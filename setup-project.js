require('shelljs/global');
var execCmd = function(cmd, ignoreError) {
  console.log('--- Executing : ' + cmd );
  var output = exec(cmd);
  if(output.code != 0 && ignoreError !== true) {
    echo("Command `" + cmd + "` failed. Please check the logs.");
    exit(1);
  } else {
    return output;
  }
}
//Execute commands
execCmd('npm install');
execCmd('bower install');
