import { Canvas } from '@react-three/fiber'
import { Color, CylinderGeometry, ExtrudeGeometry, Mesh, MeshBasicMaterial, Shape, } from 'three'
import { Terrain } from './Terrain'
import { Camera } from './Camera'
import { DrapedMesh } from './DrapedMesh'
import { Render } from './Render'
import { useControls } from 'leva'

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
  new Mesh(new CylinderGeometry(10, 10, 50, 30), new MeshBasicMaterial({ color: 0xffff00 })).translateX(-50).translateZ(-30),
  new Mesh(new ExtrudeGeometry(shape, { depth: 20 }), new MeshBasicMaterial({ color: 0xff00ff })).rotateX(-Math.PI / 2),
];

const GL_PROPS = { stencil: true };

export default function App() {
  const { drape } = useControls({ drape: true, });
  return (
    <Canvas gl={GL_PROPS}>
      <scene background={new Color(0xf0f0f)}/>
      <Render />
      <Camera />
      <ambientLight intensity={Math.PI / 2} />
      <directionalLight position={[-10, 10, -10]} intensity={Math.PI} />
      <Terrain />
      {MESHES.map(m => <DrapedMesh mesh={m} enabled={drape} />)}
    </Canvas>
  )
}
