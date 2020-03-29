import { execSync } from "child_process";
import { readdir } from "fs";

readdir(__dirname, (_, files) => {
  const libFiles = files.filter((name) => name.endsWith(".js"));
  for (const libFile of libFiles) {
    const start = Date.now();
    execSync(`time node "${__dirname}/${libFile}"`, { stdio: "ignore" });
    const duration = Date.now() - start;
    console.log(libFile.substr(0, libFile.length - 3), duration);
  }
});
