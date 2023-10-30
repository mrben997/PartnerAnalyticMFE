@echo off
@REM rmdir /s /q "./projects/ClientAdmin/build"
@REM rmdir /s /q "./projects/ClientApp/build"
@REM yarn build
rmdir /s /q "\\172.16.1.60\share\PartnerReactSourceBuild\analytics"
mkdir "\\172.16.1.60\share\PartnerReactSourceBuild\analytics"
xcopy /E /I /Y "F:\work\PartnerReactSourceMicroFE\partner-analytic-mfe\modules\app-root\dist" "\\172.16.1.60\share\PartnerReactSourceBuild\analytics"