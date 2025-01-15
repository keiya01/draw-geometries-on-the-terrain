import {  ForwardedRef, forwardRef, useEffect, useRef } from "react";
import { Mesh } from "three";
import { TEXTURE_LOADER } from "./loaders";

const DISPLACEMENT_MAP = TEXTURE_LOADER.load("displacementmap.png");
const DISPLACEMENT_MAP_NORMAL = TEXTURE_LOADER.load("displacementmapnormals.png");

type Props = {
    scale?: number
    normal?: boolean,
};

export const Terrain = forwardRef(({ scale = 30, normal }: Props, forwardedRef: ForwardedRef<Mesh | null>) => {
    const ref = useRef<Mesh | null>();
    useEffect(() => {
        ref.current?.rotateX(-Math.PI / 2);
    }, []);

    return (
        <mesh ref={(r) => {
            if(typeof forwardedRef === "function") {
                forwardedRef(r);
            } else if(forwardedRef) {
                forwardedRef.current = r;
            }
            ref.current = r;
        }}>
            <planeGeometry args={[200, 200, 100, 100]} />
            {normal
                ? <meshNormalMaterial
                    displacementScale={scale}
                    displacementMap={DISPLACEMENT_MAP}
                    normalMap={DISPLACEMENT_MAP_NORMAL}
                />
                : <meshPhongMaterial
                    color={0xaaaaaa}
                    displacementScale={scale}
                    displacementMap={DISPLACEMENT_MAP}
                    normalMap={DISPLACEMENT_MAP_NORMAL}
                />
            }
        </mesh>
    )
});
