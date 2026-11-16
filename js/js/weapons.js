export const WEAPONS = {
    pistol: {
        name: 'Duck-18 Pistol', auto: false, cost: 0, damage: 26, headshotMult: 2.0,
        fireRate: 240, range: 85, adsFov: 62,
        magSize: 15, reloadTime: 1100, pellets: 1, hipSpread: 0.025, adsSpread: 0.005,
        recoil: 0.04, pitch: 260, color: 0x333333, length: 0.45
    },
    shotgun: {
        name: 'Mallard-12 Pump', auto: false, cost: 1800, damage: 20, headshotMult: 1.75,
        fireRate: 900, range: 35, adsFov: 64,
        magSize: 6, reloadTime: 1800, pellets: 7, hipSpread: 0.11, adsSpread: 0.065,
        recoil: 0.14, pitch: 110, color: 0x5c3a21, length: 0.85
    },
    smg: {
        name: 'Quack-MP5 SMG', auto: true, cost: 1200, damage: 19, headshotMult: 2.0,
        fireRate: 85, range: 110, adsFov: 58,
        magSize: 30, reloadTime: 1400, pellets: 1, hipSpread: 0.045, adsSpread: 0.012,
        recoil: 0.025, pitch: 320, color: 0x222222, length: 0.65
    },
    rifle: {
        name: 'Duckov AK-74', auto: true, cost: 2900, damage: 44, headshotMult: 2.2,
        fireRate: 145, range: 240, adsFov: 50,
        magSize: 30, reloadTime: 1600, pellets: 1, hipSpread: 0.035, adsSpread: 0.004,
        recoil: 0.055, pitch: 180, color: 0x8b4513, length: 0.90
    },
    lmg: {
        name: 'Bread-Minigun', auto: true, cost: 5500, damage: 28, headshotMult: 1.8,
        fireRate: 65, range: 200, adsFov: 56,
        magSize: 100, reloadTime: 2800, pellets: 1, hipSpread: 0.06, adsSpread: 0.02,
        recoil: 0.04, pitch: 210, color: 0x555555, length: 1.05
    },
    sniper: {
        name: 'Feather-AWP', auto: false, cost: 4700, damage: 125, headshotMult: 2.5,
        fireRate: 1350, range: 650, adsFov: 22, isScoped: true,
        magSize: 5, reloadTime: 2200, pellets: 1, hipSpread: 0.09, adsSpread: 0.0002,
        recoil: 0.20, pitch: 95, color: 0x2e4d2e, length: 1.25
    }
};

export function createWeaponMesh(weaponKey, skinOverride = 'default') {
    const w = WEAPONS[weaponKey];
    const finishColor = skinOverride === 'default' ? w.color : parseInt(skinOverride);
    const group = new THREE.Group();

    const body = new THREE.Mesh(
        new THREE.BoxGeometry(0.10, 0.13, w.length),
        new THREE.MeshStandardMaterial({ color: finishColor, metalness: 0.5, roughness: 0.3 })
    );
    const barrel = new THREE.Mesh(
        new THREE.CylinderGeometry(0.022, 0.022, w.length + 0.15, 8),
        new THREE.MeshStandardMaterial({ color: 0x111111 })
    );
    barrel.rotation.x = Math.PI / 2;
    barrel.position.set(0, 0.04, -0.05);

    const optic = new THREE.Mesh(
        new THREE.BoxGeometry(0.05, 0.06, w.isScoped ? 0.32 : 0.08),
        new THREE.MeshStandardMaterial({ color: 0x181818 })
    );
    optic.position.set(0, 0.09, 0.02);

    group.add(body, barrel, optic);
    return group;
}
