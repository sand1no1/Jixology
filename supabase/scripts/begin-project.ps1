$ErrorActionPreference = 'Stop'

function Find-RepoRoot {
  param(
    [string]$StartDir
  )

  $current = (Resolve-Path $StartDir).Path

  while ($true) {
    $hasSupabase = Test-Path (Join-Path $current 'supabase')
    $hasClient = Test-Path (Join-Path $current 'client')
    $hasScripts = Test-Path (Join-Path $current 'scripts')

    if ($hasSupabase -and $hasClient -and $hasScripts) {
      return $current
    }

    $parent = Split-Path $current -Parent
    if ($parent -eq $current) {
      throw "No se pudo encontrar el root del repo empezando desde: $StartDir"
    }

    $current = $parent
  }
}

function Invoke-Step {
  param(
    [string]$Label,
    [scriptblock]$Action
  )

  Write-Host "== $Label =="
  & $Action

  if ($LASTEXITCODE -ne 0) {
    throw "$Label fallo con codigo $LASTEXITCODE"
  }
}

function Test-FunctionPostReady {
  param(
    [string]$Url,
    [int]$TimeoutSec = 3
  )

  try {
    Invoke-WebRequest `
      -Uri $Url `
      -Method Post `
      -ContentType "application/json" `
      -Body "{}" `
      -TimeoutSec $TimeoutSec `
      -ErrorAction Stop | Out-Null

    return $true
  }
  catch {
    # Si hubo respuesta HTTP, aunque sea 400/401/405/500,
    # significa que la funcion ya esta viva y aceptando POST.
    if ($_.Exception.Response -ne $null) {
      return $true
    }

    return $false
  }
}

$scriptDir = $PSScriptRoot
$repoRoot = Find-RepoRoot -StartDir $scriptDir
$supabaseDir = Join-Path $repoRoot 'supabase'
$bootstrapPath = Join-Path $repoRoot 'scripts\bootstrap-users.ps1'
$postBootstrapSeedPath = Join-Path $repoRoot 'client\scripts\post-bootstrap-seed.mjs'

if (-not (Test-Path $bootstrapPath)) {
  throw "No existe bootstrap-users.ps1 en: $bootstrapPath"
}

if (-not (Test-Path $postBootstrapSeedPath)) {
  throw "No existe post-bootstrap-seed.mjs en: $postBootstrapSeedPath"
}

$functionUrl = if ($env:REGISTER_USER_FUNCTION_URL) {
  $env:REGISTER_USER_FUNCTION_URL
} else {
  "http://127.0.0.1:54321/functions/v1/register_user"
}

Write-Host "Repo root detectado en: $repoRoot"
Write-Host "Supabase dir: $supabaseDir"
Write-Host "Bootstrap path: $bootstrapPath"
Write-Host "Post-bootstrap seed path: $postBootstrapSeedPath"
Write-Host "Function URL: $functionUrl"

Push-Location $supabaseDir

$functionProcess = $null

try {
  Invoke-Step "Iniciando Supabase local" {
    npx supabase start
  }

  Invoke-Step "Reseteando DB local" {
    npx supabase db reset --local
  }

  Write-Host "== Levantando Edge Function register_user =="
  $functionProcess = Start-Process `
    -FilePath "cmd.exe" `
    -ArgumentList "/c", "npx supabase functions serve register_user --no-verify-jwt" `
    -WorkingDirectory $supabaseDir `
    -PassThru `
    -WindowStyle Hidden

  Write-Host "== Esperando a que register_user este lista para POST =="

  $maxAttempts = 30
  $attempt = 0
  $ready = $false

  while (-not $ready -and $attempt -lt $maxAttempts) {
    $attempt++

    if (Test-FunctionPostReady -Url $functionUrl -TimeoutSec 3) {
      $ready = $true
      break
    }

    Write-Host "Intento ${attempt}/${maxAttempts}: la funcion aun no acepta POST..."
    Start-Sleep -Seconds 2
  }

  if (-not $ready) {
    throw "La Edge Function register_user no quedo lista para POST a tiempo."
  }

  Write-Host "== Edge Function lista =="

  $env:REGISTER_USER_FUNCTION_URL = $functionUrl

  Invoke-Step "Ejecutando bootstrap de usuarios" {
    powershell -ExecutionPolicy Bypass -File $bootstrapPath
  }

  Invoke-Step "Ejecutando post-bootstrap seed" {
    node $postBootstrapSeedPath
  }

  Write-Host "Setup local completado correctamente."
}
finally {
  Pop-Location

  if ($functionProcess -and -not $functionProcess.HasExited) {
    Stop-Process -Id $functionProcess.Id -Force
  }
}