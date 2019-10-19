cls

"$PSScriptRoot|npm start", "$PSScriptRoot|npm run electron-dev" | % {

  $ScriptBlock = {
    # accept the loop variable across the job-context barrier
    param($pathWithCmd) 
    # Get working directory and command
    $dir, $cmd = $pathWithCmd.split('|')
    # Set job dir
    Set-Location "$dir"
    # Execute a command
    Invoke-Expression $cmd
    # Just wait for a bit...
    Start-Sleep 5
  }

  $dir, $cmd = $_.split('|')
  # pass the loop variable across the job-context barrier
  Start-Job -name "$cmd" -ScriptBlock $ScriptBlock -ArgumentList $_

}

try {

  While (Get-Job -State "Running") { 

    Get-Job | Receive-Job

  }

}
catch {

  Write-Error "Something went wrong"
  
}
finally {

  Write-Warning "CTRL-C was used - Shutting down any running jobs before exiting the script. It can take some time."
  Get-Job | Where-Object { $_.Name -like "npm *" } | Remove-Job -Force -Confirm:$False
  [Console]::TreatControlCAsInput = $False
  _Exit-Script -HardExit $True

}