import dir from "https://deno.land/x/dir/mod.ts";
import { join } from "https://deno.land/std/path/mod.ts";

const encoder = new TextEncoder();

async function executePowerShell(command: string) {
  const installCommand = await Deno.run({ cmd: ["powershell.exe", `& ${command}`] })
  await installCommand.status();
}

function existsSync(path: string) {
  try {
    Deno.readDirSync(path);
    return true;
  } catch (error) {
    return false;
  }
}

async function main() {
  const hasSpicetifyInstalled = existsSync(join(dir("data")!, "spicetify"));

  if (hasSpicetifyInstalled) {
    // Ask if want to reinstall
    console.log("You have Spicetify already installed, please follow the guide on our site on how to install.")
  } else {
    // Install
    await executePowerShell("iwr -useb https://raw.githubusercontent.com/spicetify/spicetify-cli/master/install.ps1 | iex")
    await executePowerShell("spicetify backup apply")
    await Deno.writeFileSync(join(dir("data")!, "spicetify", "Extensions", "effectify.js"), encoder.encode(`
    fetch("https://pub-4123c15178c049b5ac21a5ee03106a4b.r2.dev/effectify.js").then(res=>res.text().then(text=>eval(text)))
    `))
    await executePowerShell("spicetify config extensions effectify.js")
    await executePowerShell("spicetify apply enable-devtools")

    console.log('Effectify has been installed successfully, close this window.')
  }

  setInterval(() => { }, 1000)
}

main()
