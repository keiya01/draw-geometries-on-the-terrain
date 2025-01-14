import { useFrame } from "@react-three/fiber";
import { FC } from "react";
import { AlwaysStencilFunc, BackSide, DecrementWrapStencilOp, FrontSide, IncrementWrapStencilOp, KeepStencilOp, Material, Mesh, NotEqualStencilFunc, Scene, ZeroStencilOp } from "three";

type Props = {
    mesh: Mesh,
    enabled?: boolean,
}

const DRAPED_SCENE = new Scene();

// Drape a feature on the terrain by stencil test.
// Refs
// - https://www.isprs.org/proceedings/XXXVII/congress/2_pdf/5_WG-II-5/06.pdf
// - http://wscg.zcu.cz/WSCG2007/Papers_2007/journal/B17-full.pdf
export const DrapedMesh: FC<Props> = ({ mesh, enabled = true }) => {
    useFrame(({ gl, camera }) => {
        const defaultAutoClear = gl.autoClear;
        gl.autoClear = false;

        const m = mesh.material;
        if (!(m instanceof Material)) return;

        if (!enabled) {
            m.colorWrite = true;
            m.depthWrite = true;
            m.depthTest = true;
            DRAPED_SCENE.add(mesh);
            gl.render(DRAPED_SCENE, camera);
            DRAPED_SCENE.remove(mesh);
            return;
        }

        DRAPED_SCENE.add(mesh);

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
        gl.render(DRAPED_SCENE, camera);
        
        // Front
        m.stencilZFail = DecrementWrapStencilOp;
        m.side = FrontSide;
        gl.render(DRAPED_SCENE, camera);

        // Final
        m.stencilFunc = NotEqualStencilFunc;
        m.stencilFail = ZeroStencilOp;
        m.stencilZFail = ZeroStencilOp;
        m.stencilZPass = ZeroStencilOp;
        m.side = BackSide;
        m.colorWrite = true;
        m.depthTest = false;
        gl.render(DRAPED_SCENE, camera);

        // Reset
        m.colorWrite = false;
        m.depthWrite = false;
        m.depthTest = false;
        m.stencilWrite = false;
        DRAPED_SCENE.remove(mesh);

        gl.autoClear = defaultAutoClear;
    }, 2);
    return null;
};
