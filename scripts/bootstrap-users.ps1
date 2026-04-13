$users = @(
  @{
    email = "juan.guarnizo@gmail.com"
    password = "1234"
    telefono = "+521234567890"
    nombre = "Juan"
    apellido = "Guarnizo"
    fecha_nacimiento = "1990-01-01"
    sobre_mi = "Usuario administrador inicial del sistema."
    jornada = 8
    id_zona_horaria = 1
    id_rol_global = 1
  }
)

foreach ($user in $users) {
  $body = $user | ConvertTo-Json

  Invoke-RestMethod `
    -Method POST `
    -Uri "http://127.0.0.1:54321/functions/v1/register_user" `
    -ContentType "application/json" `
    -Body $body
}