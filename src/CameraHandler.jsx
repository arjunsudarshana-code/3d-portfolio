import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const CameraHandler = ({ matrixEntered, showProjects, isZoomed }) => {
  
  // 🔒 CAMERA 1 OVERVIEW - ඔයා මුලින්ම සෙට් කරපු ඇන්ගල් එක
  const overviewX = 0.35;
  const overviewY = -0.90;
  const overviewZ = 3.50;
  const overviewLookX = -0.05;
  const overviewLookY = -0.85;
  const overviewLookZ = -0.45;

  // 🔒 CAMERA 2 ZOOMED SCREEN - image_76a465.jpg එකෙන් ඔයා අන්තිමටම ගත්ත නියම අගයන් ටික[cite: 3]
  const zoomX = -1.47;
  const zoomY = -0.58;
  const zoomZ = -0.30;
  const zoomLookX = 0.76;
  const zoomLookY = -0.08;
  const zoomLookZ = 2.16;

  const targetPos = new THREE.Vector3();
  const targetLook = new THREE.Vector3();

  useFrame((state) => {
    if (isZoomed) {
      // 2 වෙනි කැමරාව (Zoomed Flat View)
      targetPos.set(zoomX, zoomY, zoomZ);
      targetLook.set(zoomLookX, zoomLookY, zoomLookZ);
    } else if (matrixEntered && showProjects) {
      // 1 වෙනි කැමරාව (Overview View)
      targetPos.set(overviewX, overviewY, overviewZ);
      targetLook.set(overviewLookX, overviewLookY, overviewLookZ);
    } else {
      // Default Hero Screen
      targetPos.set(0, 0, 6);
      targetLook.set(0, 0, 0);
    }

    // කැමරාව උඩුයටිකුරු වීම සදහටම වළක්වයි
    state.camera.up.set(0, 1, 0);

    // Smooth Lerp ඇනිමේෂන් එක
    state.camera.position.lerp(targetPos, 0.1);
    state.camera.lookAt(targetLook);
  });

  return null;
};