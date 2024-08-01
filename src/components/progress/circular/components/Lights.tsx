export const Lights = () => {
  return (
    <>
      {/* Main white light from the top */}
      <directionalLight
        position={[0, 10, 0]}
        intensity={0.5}
        color={0xffffff} // white color
        castShadow
      />

      {/* Blueish light from the top-right */}
      <directionalLight
        position={[5, 5, 10]}
        intensity={0.25}
        color={0xaaaacc} // rgba(170, 170, 204)
        castShadow
      />

      {/* Stronger blueish light from the top-left */}
      <directionalLight
        position={[-5, 5, 10]}
        intensity={0.5}
        color={0xaaaacc} // rgba(170, 170, 204)
        castShadow
      />

      {/* Stronger white light from the bottom-right */}
      <directionalLight
        position={[10, -10, 20]}
        intensity={0.5}
        color={0xffffff} // white color
        castShadow
      />

      {/* Weaker white light from the bottom-left */}
      <directionalLight
        position={[-10, -10, 20]}
        intensity={0.25}
        color={0xffffff} // white color
        castShadow
      />
    </>
  );
};
