import { useFrame } from "@react-three/fiber";
import { FC } from "react";
import { AlwaysStencilFunc, BackSide, DecrementWrapStencilOp, FrontSide, IncrementWrapStencilOp, KeepStencilOp, Material, Mesh, NotEqualStencilFunc, Scene, Texture, ZeroStencilOp } from "three";

type Props = {
    scene: Scene,
    mesh: Mesh,
    enabled?: boolean,
    normalMap?: Texture,
}

// Drape a feature on the terrain by stencil test.
// Refs
// - https://www.isprs.org/proceedings/XXXVII/congress/2_pdf/5_WG-II-5/06.pdf
// - http://wscg.zcu.cz/WSCG2007/Papers_2007/journal/B17-full.pdf
export const DrapedMesh: FC<Props> = ({ scene, mesh, enabled = true, normalMap }) => {
    useFrame(({ gl, camera }) => {
        const defaultAutoClear = gl.autoClear;
        gl.autoClear = false;

        const m = mesh.material;
        if (!(m instanceof Material)) return;

        if ("normalMap" in m) {
            m.normalMap = normalMap;
        }

        if (!enabled) {
            m.colorWrite = true;
            m.depthWrite = true;
            m.depthTest = true;
            scene.add(mesh);
            gl.render(scene, camera);
            scene.remove(mesh);
            gl.autoClear = defaultAutoClear;
            return;
        }

        scene.add(mesh);

        // Back
        m.stencilFunc = AlwaysStencilFunc;
        m.stencilFail = KeepStencilOp;
        m.stencilZPass = KeepStencilOp;
        m.stencilZFail = IncrementWrapStencilOp;
        m.side = BackSide;
        m.colorWrite = false;
        m.depthWrite = false;
        m.stencilWrite = true;
        m.depthTest = true;
        gl.render(scene, camera);
        
        // Front
        m.stencilZFail = DecrementWrapStencilOp;
        m.side = FrontSide;
        gl.render(scene, camera);

        // Final
        m.stencilFunc = NotEqualStencilFunc;
        m.stencilFail = ZeroStencilOp;
        m.stencilZFail = ZeroStencilOp;
        m.stencilZPass = ZeroStencilOp;
        m.side = BackSide;
        m.colorWrite = true;
        m.depthTest = false;
        gl.render(scene, camera);

        // Reset
        m.colorWrite = false;
        m.depthWrite = false;
        m.depthTest = false;
        m.stencilWrite = false;
        scene.remove(mesh);

        gl.autoClear = defaultAutoClear;
    }, 2);
    return null;
};
