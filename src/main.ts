import "./main.css"
import newPixelsSketch from "./pixels"

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
<div>
    <div id="canvas"></div>
    <p class="text-center text-xl text-green p-2">
        Pixel Box by <a class="text-sky hover:underline" href="https://github.com/mymmrac">@mymmrac</a>
    </p>
</div>
`

newPixelsSketch(document.getElementById("canvas")!)
