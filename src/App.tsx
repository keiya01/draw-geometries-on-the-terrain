import { Canvas } from '@react-three/fiber'
import { Color, CylinderGeometry, ExtrudeGeometry, Mesh, Scene, Shape, WebGLRenderTarget, } from 'three'
import { Terrain } from './Terrain'
import { Camera } from './Camera'
import { DrapedMesh } from './DrapedMesh'
import { Render } from './Render'
import { useControls } from 'leva'
import { useState } from 'react'
import { DrapedLambertMaterial } from './DrapedMaterial'

const shape = new Shape();
const width = 10;
shape.moveTo(-100, 100);
shape.lineTo(width, 100);
shape.lineTo(width, -100 + width);
shape.lineTo(100, -100 + width);
shape.lineTo(100, -100);
shape.lineTo(0, -100);
shape.lineTo(0, 100 - width);
shape.lineTo(-100, 100 - width);

const MESHES = [
  new Mesh(new CylinderGeometry(10, 10, 100, 30), new DrapedLambertMaterial({ color: 0xffff00 })).translateX(-50).translateZ(-30),
  new Mesh(new ExtrudeGeometry(shape, { depth: 60 }), new DrapedLambertMaterial({ color: 0xff00ff })).rotateX(-Math.PI / 2).translateZ(-30),
];

const GL_PROPS = { stencil: true };

const NORMAL_RENDER_TARGET = new WebGLRenderTarget(window.innerWidth, window.innerHeight);

export default function App() {
  const { drape, terrainScale } = useControls({
    drape: true,
    terrainScale: {
      value: 30,
      min: -20,
      max: 50,
    },
  });
  const [drapedScene] = useState(() => new Scene());
  const [normalScene] = useState(() => new Scene());

  return (
    <Canvas gl={GL_PROPS}>
      <scene background={new Color(0xf0f0f)}/>
      <Render renderTarget={NORMAL_RENDER_TARGET} scene={normalScene} />
      <Render />
      <Camera />
      <ambientLight intensity={Math.PI / 2} />
      <ambientLight ref={(r) => {
        if(r) {
          drapedScene.add(r);
          normalScene.add(r.clone());
        }
      }} intensity={Math.PI / 2} />
      <directionalLight position={[-10, 10, -10]} intensity={Math.PI} />
      <directionalLight ref={(r) => {
        if(r) {
          drapedScene.add(r);
          normalScene.add(r.clone());
        }
      }} position={[-10, 10, -10]} intensity={Math.PI} />
      <Terrain scale={terrainScale} />
      <Terrain ref={(r) => r ? normalScene.add(r) : null} scale={terrainScale} normal />
      {MESHES.map(m => <DrapedMesh scene={drapedScene} mesh={m} enabled={drape} normalMap={NORMAL_RENDER_TARGET.texture} />)}
    </Canvas>
  )
}
