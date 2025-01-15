import { useFrame } from "@react-three/fiber";
import { FC } from "react";
import { Scene, WebGLRenderTarget } from "three";

type Props = {
    scene?: Scene,
    renderTarget?: WebGLRenderTarget,
}

export const Render: FC<Props> = ({ scene, renderTarget }) => {
    useFrame(({ gl, scene: originalScene, camera }) => {
        if(renderTarget) {
            gl.setRenderTarget(renderTarget);
        }
        gl.render(scene ?? originalScene, camera);
        gl.setRenderTarget(null);
    }, 1);

    return null;
};
