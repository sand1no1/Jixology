import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'npm:@supabase/supabase-js@2';

type RegisterUserPayload = {
  email: string;
  password: string;
  telefono: string | null;
  nombre: string | null;
  apellido: string | null;
  fecha_nacimiento: string | null;
  sobre_mi: string | null;
  jornada: number | null;
  id_zona_horaria: number;
  id_rol_global: number;
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseAnonKey =
  Deno.env.get('SUPABASE_ANON_KEY') ??
  Deno.env.get('SUPABASE_PUBLISHABLE_KEY')!;
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const adminClient = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  let createdAuthUserId: string | null = null;

  try {
    const body = (await req.json()) as RegisterUserPayload;

    const email = body.email?.trim().toLowerCase();
    const password = body.password;

    if (!email || !password || !body.id_zona_horaria) {
      return Response.json(
        { error: 'Faltan campos obligatorios.' },
        { status: 400, headers: corsHeaders }
      );
    }

    const { count, error: countError } = await adminClient
      .from('usuario')
      .select('id', { count: 'exact', head: true });

    if (countError) {
      return Response.json(
        { error: countError.message },
        { status: 500, headers: corsHeaders }
      );
    }

    const isBootstrapMode = (count ?? 0) === 0;

    if (!isBootstrapMode) {
      const authHeader = req.headers.get('Authorization');

      if (!authHeader) {
        return Response.json(
          { error: 'Necesitas iniciar sesión como administrador para crear usuarios.' },
          { status: 401, headers: corsHeaders }
        );
      }

      const callerClient = createClient(supabaseUrl, supabaseAnonKey, {
        global: {
          headers: {
            Authorization: authHeader,
          },
        },
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      });

      const {
        data: { user: callerUser },
        error: callerError,
      } = await callerClient.auth.getUser();

      if (callerError || !callerUser) {
        return Response.json(
          { error: 'Unauthorized.' },
          { status: 401, headers: corsHeaders }
        );
      }

      const { data: callerProfile, error: callerProfileError } = await adminClient
        .from('usuario')
        .select('id_rol_global')
        .eq('auth_id', callerUser.id)
        .maybeSingle();

      if (callerProfileError) {
        return Response.json(
          { error: callerProfileError.message },
          { status: 500, headers: corsHeaders }
        );
      }

      if (!callerProfile || callerProfile.id_rol_global !== 1) {
        return Response.json(
          { error: 'Forbidden. Solo un administrador puede crear usuarios.' },
          { status: 403, headers: corsHeaders }
        );
      }
    }

    const roleToInsert = isBootstrapMode ? 1 : body.id_rol_global;

    const { data: authData, error: authError } =
      await adminClient.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

    if (authError || !authData.user) {
      return Response.json(
        { error: authError?.message || 'No se pudo crear el usuario en Auth.' },
        { status: 400, headers: corsHeaders }
      );
    }

    createdAuthUserId = authData.user.id;

    const { data: usuarioData, error: usuarioError } = await adminClient
      .from('usuario')
      .insert({
        auth_id: createdAuthUserId,
        email,
        telefono: body.telefono,
        nombre: body.nombre,
        apellido: body.apellido,
        fecha_nacimiento: body.fecha_nacimiento,
        sobre_mi: body.sobre_mi,
        jornada: body.jornada,
        fecha_creacion: new Date().toISOString(),
        id_zona_horaria: body.id_zona_horaria,
        id_rol_global: roleToInsert,
      })
      .select()
      .single();

    if (usuarioError) {
      await adminClient.auth.admin.deleteUser(createdAuthUserId);

      return Response.json(
        { error: usuarioError.message || 'No se pudo insertar en public.usuario.' },
        { status: 400, headers: corsHeaders }
      );
    }

    return Response.json(
      {
        message: isBootstrapMode
          ? 'Primer usuario administrador creado correctamente.'
          : 'Usuario creado correctamente.',
        auth_id: createdAuthUserId,
        usuario: usuarioData,
        bootstrap: isBootstrapMode,
      },
      { status: 201, headers: corsHeaders }
    );
  } catch (error) {
    if (createdAuthUserId) {
      await adminClient.auth.admin.deleteUser(createdAuthUserId);
    }

    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Ocurrió un error inesperado en la Edge Function.',
      },
      { status: 500, headers: corsHeaders }
    );
  }
});