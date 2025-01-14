import { OrbitControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { OrbitControls as OrbitControlsImpl } from "three-stdlib";

export const Camera = () => {
    const orbitRef = useRef<OrbitControlsImpl>(null);
    const {camera} = useThree();


    useEffect(() => {
        // camera.up.set(0, 0, 1);
        // camera.lookAt(new Vector3(0, 0, 0));
        if (!orbitRef.current) return;
        orbitRef.current.setPolarAngle(Math.PI / 3);
        orbitRef.current.setScale(20);
        orbitRef.current.enableDamping = false;
        orbitRef.current.update();
        orbitRef.current.enableDamping = true;
    }, []);

    return (
        <>
            <OrbitControls ref={orbitRef} camera={camera} makeDefault />
        </>
    );
}