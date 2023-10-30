@echo off
@REM yarn build
rmdir /s /q "\\172.16.1.60\share\PartnerReactSourceBuild\analytics"
mkdir "\\172.16.1.60\share\PartnerReactSourceBuild\analytics"
xcopy /E /I /Y "F:\work\PartnerReactSourceMicroFE\partner-analytic-mfe\modules\app-root\dist" "\\172.16.1.60\share\PartnerReactSourceBuild\analytics"