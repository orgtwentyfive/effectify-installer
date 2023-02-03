const encoder = new TextEncoder();
import chalkin from "https://deno.land/x/chalkin/mod.ts";
import dir from "https://deno.land/x/dir/mod.ts";
import { join } from "https://deno.land/std/path/mod.ts";
import { spicetifyPath } from "./constants.ts";


export async function executePowerShell(command: string, spicetifycwd?: boolean) {
    const commandParam: { cmd: string[], cwd?: string } = { cmd: ["powershell.exe", `& ${command}`] };
    if (spicetifycwd) {
        commandParam.cwd = spicetifyPath
    }
    const installCommand = Deno.run(commandParam)
    await installCommand.status();
}

export function existsDataDir(folderName: string) {
    try {
        Deno.readDirSync(join(dir("data")!, folderName));
        return true;
    } catch (error) {
        return false;
    }
}

export function utf8(text: string) {
    return encoder.encode(text)
}

export function log(...args: string[]) {
    console.log(chalkin.bold.magenta("<Effectify>"), ...args);
}

export async function closeSpotify() {
    return new Promise<void>((res, rej) => {
        setTimeout(async () => {
            try {
                const command = Deno.run({ cmd: ["taskkill", "/IM", "Spotify.exe"] })
                await command.status();
            } catch (error) { }
            res()
        }, 15000)
    })
}