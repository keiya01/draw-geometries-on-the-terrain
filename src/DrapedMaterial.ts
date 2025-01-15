import { MeshLambertMaterial, WebGLProgramParametersWithUniforms } from "three";

export class DrapedLambertMaterial extends MeshLambertMaterial {
    onBeforeCompile(parameters: WebGLProgramParametersWithUniforms): void {
        parameters.fragmentShader = parameters.fragmentShader.replace("#include <normal_fragment_maps>", `
vec2 uv = gl_FragCoord.xy / vec2(textureSize(normalMap, 0));
vec3 mapN = texture2D( normalMap, uv ).xyz * 2.0 - 1.0;
mapN.xy *= 3.;
normal = normalize( mapN );
`);
    }
}