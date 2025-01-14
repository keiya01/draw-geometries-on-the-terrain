import { useEffect, useRef } from "react";
import { Mesh } from "three";
import { TEXTURE_LOADER } from "./loaders";

const DISPLACEMENT_MAP = TEXTURE_LOADER.load("displacementmap.png");
const DISPLACEMENT_MAP_NORMAL = TEXTURE_LOADER.load("displacementmapnormals.png");

export const Terrain = () => {
    const ref = useRef<Mesh>(null);
    useEffect(() => {
        ref.current?.rotateX(-Math.PI / 2);
    }, []);
    return (
        <mesh ref={ref}>
            <planeGeometry args={[200, 200, 100, 100]} />
            <meshPhongMaterial color={0xaaaaaa} displacementScale={30} displacementMap={DISPLACEMENT_MAP} normalMap={DISPLACEMENT_MAP_NORMAL} />
        </mesh>
    )
};
