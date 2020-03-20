function KillThatProcess{
    param($name)
    if ($name -as [int] -is [int]){
        Write-Host -BackgroundColor Black -ForegroundColor Red "The parameter must be a name, not a number";
    }
    else{
        try{
            ps $name;
            Write-Host "";
            $result = ps $name;
            $matches = sls -InputObject $result -Pattern $name -AllMatches;
            $num = $matches.Matches.Count;
            if ($num -eq 1){
                Write-Host "There is"$matches.Matches.Count$name" running";
            }
            if ($num -gt 1){
                Write-Host "There are"$matches.Matches.Count$name"s running";
            }
            if ($num -ne 0){
                Write-Host -NoNewLIne "Proceed killing? Y/N ";
                $decision = Read-Host;
                Write-Host "";
                if ($decision.ToLower() -eq "y"){
                    kill -Name $name -Force;
                    Write-Host -ForegroundColor Green "Process killed";
                }
                else {
                    if ($num -eq 1) {
                        Write-Host -ForegroundColor Yellow "You chose to let that process live";
                    }
                    else {
                        Write-Host -ForegroundColor Yellow "You chose to let those processes live";
                    }
                }
            }
        }
        catch{
            Write-Host -BackgroundColor Black -ForegroundColor Red "Unexpected Error Occurred";
            Write-Host -BackgroundColor Black -ForegroundColor Red $_;
        }
    }
}
function Bamboozle {
    param ($path = (Get-Location).Path)

    try {
        $char = [char]((97..122) | Get-Random -Count 1);
        Write-Host -NoNewLine -ForegroundColor Red '"'`b$char'"';
        Write-Host " is the virus !!!";
        Write-Host "We need to kill all the infected files before it spread out"
        Write-Host "";
        Write-Host -NoNewLine -ForegroundColor Yellow "Go for searching? Y/N ";
        $decision = Read-Host;
        Write-Host "";
        if ($decision.ToLower() -eq "y") {
            if ((ls -Path "$path/*$char*", "$path/$char*", "$path/*$char" -File | Measure-Object).Count -eq 0) {
                Write-Host -ForegroundColor Green "No infected has been found in this area"
            }
            else {
                Write-Host "";
                Write-Host -NoNewLine "    List of infected file(s) with ";
                Write-Host -NoNewLine -ForegroundColor Red '"'`b$char'"'
                Write-Host -NoNewline " in:";
                ls -Path "$path/$char*", "$path/*$char" -File;
                ls -Path "$path/*$char*" -File -Exclude "$char*";
                Write-Host "";
                $decision = Read-Host "Exterminate? Y/N";
                Write-Host "";
                if ($decision.ToLower() -eq "y") {
                    ri "$path/$char*", "$path/*$char", "$path/*$char*" -Include "*.*" -wi;
                    Write-Host -ForegroundColor Green "Fake removed OK";
                }
                else {
                    Write-Host -ForegroundColor Yellow "Extermination Abort";
                }
            }
        }
        else {
            Write-Host -ForegroundColor Yellow "Search canceled"
        }
        Write-Host "";
    }
    catch {
        Write-Host -BackgroundColor Black -ForegroundColor Red "Unexpected Error Occurred";
        Write-Host -BackgroundColor Black -ForegroundColor Red $_;
    }
}

Write-Host -NoNewline -ForegroundColor Yellow "You need to kill something? Y/N ";
$decision = Read-Host;
if ($decision.ToLower() -eq "y") {
    Write-Host "";
    Write-Host -NoNewline "1. ";
    Write-Host -NoNewline -ForegroundColor Green "KillThatProcess";
    Write-Host ": eliminate all chosen processes";
    Write-Host -NoNewline "2. ";
    Write-Host -NoNewline -ForegroundColor Green "Bamboozle";
    Write-Host ": detect the virus and kill all the infected files in a target area"
    Write-Host "";
    Write-Host -NoNewline -ForegroundColor Yellow "[] Enter your choice number ";
    $decision = Read-Host;
    Write-Host "";
    switch ($decision) {
        1 {
            $name = Read-Host "Give me a name, I'll kick its ass!!! ";
            KillThatProcess $name;
        }

        2 {
            Write-Host "Give me a path to the area you want me to scan (no need for quotation marks)";
            Write-Host "Or press ENTER to scan current location . . ."
            Write-Host "";
            $path = Read-Host;
            if ($path -eq "`0") {
                Bamboozle;
            }
            else {
                Bamboozle $path;
            }
        }
    }
}
else {
    Write-Host -ForegroundColor Yellow "Program quit";
}