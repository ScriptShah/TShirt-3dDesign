import { proxy } from "valtio";

const state = proxy ({
    intro : true,
    color: '#2ccce4',
    isLogoTexture: false,
    isFullTexture: false,
    logoDecal : './threejs.png',
    fullDecal : './threejs.png',
});

export default state;