const encoder = new TextEncoder();
import chalkin from "https://deno.land/x/chalkin/mod.ts";
import dir from "https://deno.land/x/dir/mod.ts";
import { join } from "https://deno.land/std/path/mod.ts";


export async function executePowerShell(command: string) {
    const installCommand = await Deno.run({ cmd: ["powershell.exe", `& ${command}`] })
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