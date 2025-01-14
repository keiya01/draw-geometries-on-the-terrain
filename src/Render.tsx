import { useFrame } from "@react-three/fiber";
import { FC } from "react";

export const Render: FC = () => {
    useFrame(({ gl, scene, camera }) => {
        gl.render(scene, camera);
    }, 1);

    return null;
};
