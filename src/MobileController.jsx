import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export default function MobileController() {
  const { camera, size } = useThree();

  useFrame(() => {
    // ෆෝන් එකක්ද (Mobile) නැත්නම් PC එකක්ද කියලා ස්ක්‍රීන් එකේ පළලින් අඳුරගන්නවා
    const isMobile = size.width < 768;
    
    // PC එකට FOV 45යි, Mobile එකට FOV 75යි (මුළු 3D පරිසරයම ෆෝන් එකට ෆිට් වෙන්න)
    const targetFOV = isMobile ? 75 : 45; 
    
    // එකපාරට කට් නොවී, පට්ටම Smooth විදිහට කැමරාව Zoom in / Zoom out වෙනවා
    camera.fov = THREE.MathUtils.lerp(camera.fov, targetFOV, 0.05);
    camera.updateProjectionMatrix();
  });

  return null; // මේක Background controller එකක් නිසා render වෙන්න දෙයක් නෑ
}