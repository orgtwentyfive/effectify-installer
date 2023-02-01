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
  const hasSpotifyInstalled = existsSync(join(dir("data")!, "Spotify"));

  if (!hasSpotifyInstalled) {
    console.log("Effectify doesn't work with Spotify installed from Windows Store.")

    const shouldProceed = confirm("Do you wish to quickly re-install it using Legacy Installer ?  (You will have to login again) ");
    console.log("Should reinstall?", shouldProceed);

    if (!shouldProceed) {
      console.log("Install aborted")
      return;
    }

    console.log("Removing Spotify Store App")
    await executePowerShell("Get-AppxPackage *spotify* | Remove-AppxPackage")
    console.log("Downloading SpotifySetup.exe")
    await executePowerShell(`Invoke-WebRequest https://download.scdn.co/SpotifySetup.exe -OutFile "SpotifySetup.exe"`)
    await executePowerShell(`Start-Process -FilePath 'SpotifySetup.exe'`)

    console.log("Waiting for installer to finish")
    while (true) {
      try {
        await Deno.remove("./SpotifySetup.exe")
        console.log("Removed the setup")
        break;
      } catch (error) {
      }
    }
    console.log('Finished Installing')
  }

  if (hasSpicetifyInstalled) {
    // Ask if want to install only extension
    console.log("You have Spicetify already installed, please follow the guide on our site on how to install.")
    const shouldProceed = confirm("Do you wish to install the extension only? ");

    if (shouldProceed) {
      await installExtension();
    }
    return;
  }

  // Install
  await executePowerShell("iwr -useb https://raw.githubusercontent.com/spicetify/spicetify-cli/master/install.ps1 | iex")
  await executePowerShell("spicetify backup apply")
  await installExtension();

  console.log('Effectify has been installed successfully, close this window.')
}

async function installExtension() {
  await Deno.writeFileSync(join(dir("data")!, "spicetify", "Extensions", "effectify.js"), encoder.encode(`
    fetch("https://pub-4123c15178c049b5ac21a5ee03106a4b.r2.dev/effectify.js").then(res=>res.text().then(text=>eval(text)))
    `))
  await executePowerShell("spicetify config extensions effectify.js")
  await executePowerShell("spicetify apply enable-devtools")
}


async function mainWrapper() {
  await main()
  setInterval(() => { }, 1000)
}

mainWrapper();