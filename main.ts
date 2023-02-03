
import { extensionContents, extensionPath } from "./modules/constants.ts";
import { closeSpotify, executePowerShell, existsDataDir, log, utf8 } from "./modules/utils.ts";




async function main() {
  log("Welcome to Effectify Installer Beta")

  const shouldInstall = confirm("Do you want to install Effectify for Spotify ?");
  if (!shouldInstall) {
    log("Install aborted")
    return;
  }

  const hasSpicetifyInstalled = existsDataDir("spicetify");
  const hasSpotifyInstalled = existsDataDir("Spotify");
  if (!hasSpotifyInstalled) {
    log("Effectify doesn't work with Spotify installed from Windows Store.")
    const shouldProceed = confirm("Do you wish to quickly re-install it using Legacy Installer ?  (You will have to login again) ");

    if (!shouldProceed) {
      log("Install aborted")
      return;
    }

    log("Removing Spotify Store App")
    await executePowerShell("Get-AppxPackage *spotify* | Remove-AppxPackage")
    log("Downloading SpotifySetup.exe")
    await executePowerShell(`Invoke-WebRequest https://download.scdn.co/SpotifySetup.exe -OutFile "SpotifySetup.exe"`)
    await executePowerShell(`Start-Process -FilePath 'SpotifySetup.exe'`)

    log("Waiting for installer to finish")
    while (true) {
      try {
        await Deno.remove("./SpotifySetup.exe")
        log("Removed the setup")
        break;
      } catch (error) { }
    }
    log('Please wait...')
    await closeSpotify()
  }

  if (hasSpicetifyInstalled) {
    log("You have Spicetify already installed, please follow the guide on our site on how to install.")
    const shouldProceed = confirm("Do you wish to install the extension only? ");

    if (shouldProceed) {
      await installExtension();
      log("Effectify has been installed successfully, close this window.")
    } else {
      log("Install aborted")
    }
    return;
  }

  await executePowerShell("iwr -useb https://raw.githubusercontent.com/spicetify/spicetify-cli/master/install.ps1 | iex")
  await installExtension();

  log('Effectify has been installed successfully, close this window.')
}

async function installExtension() {
  await executePowerShell("./spicetify backup apply", true)
  await Deno.writeFileSync(extensionPath, utf8(extensionContents))
  await executePowerShell("./spicetify config extensions effectify.js", true)
  await executePowerShell("./spicetify apply enable-devtools", true)
}


async function mainWrapper() {
  await main()
  alert("Press any key to exit")
}

mainWrapper();