export class AssetManager {
    constructor() {
        this.loader = new THREE.GLTFLoader();
    }

    loadDuckModel(colorHex = 0xffd700) {
        return new Promise((resolve) => {
            this.loader.load(
                'assets/duck.glb',
                (gltf) => {
                    const model = gltf.scene;
                    let mixer = null;
                    if (gltf.animations && gltf.animations.length > 0) {
                        mixer = new THREE.AnimationMixer(model);
                        mixer.clipAction(gltf.animations).play();
                    }
                    model.userData.mixer = mixer;
                    resolve(model);
                },
                undefined,
                () => {
                    const duck = new THREE.Group();
                    const mat = new THREE.MeshStandardMaterial({ color: parseInt(colorHex) });
                    const orangeMat = new THREE.MeshStandardMaterial({ color: 0xff6600 });

                    const body = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.1, 1.4), mat);
                    body.position.y = 1.1;

                    // Tagged Head & Beak for 2x Headshot Multiplier Detection
                    const head = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.75, 0.75), mat);
                    head.position.set(0, 1.95, 0.35);
                    head.userData.isHead = true;

                    const beak = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.2, 0.55), orangeMat);
                    beak.position.set(0, 1.85, 0.9);
                    beak.userData.isHead = true;

                    const leftFoot = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.5, 0.5), orangeMat);
                    leftFoot.position.set(-0.35, 0.25, 0);

                    const rightFoot = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.5, 0.5), orangeMat);
                    rightFoot.position.set(0.35, 0.25, 0);

                    const leftWing = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.7, 0.9), mat);
                    leftWing.position.set(-0.65, 1.15, 0);

                    const rightWing = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.7, 0.9), mat);
                    rightWing.position.set(0.65, 1.15, 0);

                    duck.add(body, head, beak, leftFoot, rightFoot, leftWing, rightWing);
                    duck.userData.limbs = { leftFoot, rightFoot, leftWing, rightWing };
                    resolve(duck);
                }
            );
        });
    }
}
