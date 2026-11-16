export class MapBuilder {
    constructor(scene) {
        this.scene = scene;
        this.colliders = [];
        this.mapObjects = [];
        this.destructibles = [];
        this.siteA = new THREE.Vector3(-55, 0, -40);
        this.siteB = new THREE.Vector3(55, 0, -40);
        this.extractPos = new THREE.Vector3(0, 0, -320);
        this.vaultPos = new THREE.Vector3(0, 1.5, 0);
        this.cashoutPos = new THREE.Vector3(0, 0, -140);
    }

    createRNG(seed) {
        let s = seed % 2147483647;
        if (s <= 0) s += 2147483646;
        return () => (s = (s * 16807) % 2147483647) / 2147483647;
    }

    clear() {
        this.mapObjects.forEach((obj) => this.scene.remove(obj));
        this.mapObjects = [];
        this.colliders = [];
        this.destructibles = [];
    }

    buildLobbyRange() {
        this.clear();
        this.scene.background = new THREE.Color(0x1f2937);
        this.scene.fog = new THREE.Fog(0x1f2937, 20, 140);
        this.addGround(140, 0x374151);
        this.addBox(0, 4, -40, 60, 8, 2, 0xf59e0b);
        this.addBox(-30, 4, -10, 2, 8, 60, 0x4b5563);
        this.addBox(30, 4, -10, 2, 8, 60, 0x4b5563);
        this.addBox(-8, 1.5, -12, 6, 3, 2, 0x6b7280);
        this.addBox(8, 1.5, -12, 6, 3, 2, 0x6b7280);
        return this.colliders;
    }

    buildRandomMap(mode, seed) {
        this.clear();
        const rand = this.createRNG(seed);

        if (mode === 'extraction') {
            this.scene.background = new THREE.Color(0x6ba3be);
            this.scene.fog = new THREE.Fog(0x6ba3be, 40, 420);
            this.addGround(900, 0x3b5e2b);
            this.extractPos.set((rand() - 0.5) * 400, 0, -280 - rand() * 100);

            for (let i = 0; i < 190; i++) {
                const x = (rand() - 0.5) * 800;
                const z = (rand() - 0.5) * 800;
                if (Math.hypot(x, z - 40) < 25) continue;
                if (i % 4 === 0) this.addBox(x, 4, z, 14 + rand() * 12, 8, 10 + rand() * 10, 0x6e737b);
                else this.addTree(x, z);
            }
        } 
        else if (mode === 'br100') {
            this.scene.background = new THREE.Color(0x87ceeb);
            this.scene.fog = new THREE.Fog(0x87ceeb, 60, 550);
            this.addGround(1600, 0x4a7c36);

            for (let c = 0; c < 18; c++) {
                const cx = (rand() - 0.5) * 1300;
                const cz = (rand() - 0.5) * 1300;
                for (let b = 0; b < 5; b++) {
                    const bx = cx + (rand() - 0.5) * 70;
                    const bz = cz + (rand() - 0.5) * 70;
                    const h = 10 + rand() * 20;
                    this.addBox(bx, h / 2, bz, 18 + rand() * 10, h, 18 + rand() * 10, 0x8c7b6b);
                }
            }
            for (let t = 0; t < 220; t++) {
                const tx = (rand() - 0.5) * 1450;
                const tz = (rand() - 0.5) * 1450;
                if (Math.hypot(tx, tz) > 30) this.addTree(tx, tz);
            }
        } 
        else if (mode === 'valorant') {
            this.scene.background = new THREE.Color(0xd9a773);
            this.scene.fog = new THREE.Fog(0xd9a773, 35, 240);
            this.addGround(260, 0xc2b280);

            this.addBox(0, 6, -120, 240, 12, 4, 0x7c5e42);
            this.addBox(0, 6, 120, 240, 12, 4, 0x7c5e42);
            this.addBox(-120, 6, 0, 4, 12, 240, 0x7c5e42);
            this.addBox(120, 6, 0, 4, 12, 240, 0x7c5e42);

            this.siteA.set(-65 + (rand() - 0.5) * 15, 0, -45 + (rand() - 0.5) * 15);
            this.siteB.set(65 + (rand() - 0.5) * 15, 0, -45 + (rand() - 0.5) * 15);

            this.addBox(-30, 5, 10, 12, 10, 75, 0x9e7b56);
            this.addBox(30, 5, 10, 12, 10, 75, 0x9e7b56);

            for (let i = 0; i < 26; i++) {
                const bx = (rand() - 0.5) * 190;
                const bz = (rand() - 0.5) * 170;
                if (Math.hypot(bx, bz - 85) < 20 || Math.hypot(bx, bz + 85) < 20) continue;
                this.addBox(bx, 2.5, bz, 6 + rand() * 8, 5, 6 + rand() * 8, 0x3b82f6);
            }
        }
        else if (mode === 'finals') {
            // The Finals Urban Arena with Destructible Walls
            this.scene.background = new THREE.Color(0x0ea5e9);
            this.scene.fog = new THREE.Fog(0x0ea5e9, 45, 340);
            this.addGround(420, 0x334155);

            this.vaultPos.set((rand() - 0.5) * 120, 1.5, (rand() - 0.5) * 80);
            this.cashoutPos.set((rand() - 0.5) * 180, 0, -130 - rand() * 40);

            for (let i = 0; i < 55; i++) {
                const bx = (rand() - 0.5) * 340;
                const bz = (rand() - 0.5) * 340;
                if (Math.hypot(bx, bz - 90) < 25) continue;
                const isDestructible = (i % 2 === 0);
                this.addBox(bx, 4, bz, 12, 8, 12, isDestructible ? 0xf59e0b : 0x64748b, isDestructible);
            }
        }
        return this.colliders;
    }

    destroyWallsInRadius(pos, radius) {
        for (let i = this.destructibles.length - 1; i >= 0; i--) {
            const d = this.destructibles[i];
            if (d.mesh.position.distanceTo(pos) < radius) {
                this.scene.remove(d.mesh);
                const cIdx = this.colliders.indexOf(d.box);
                if (cIdx !== -1) this.colliders.splice(cIdx, 1);
                this.destructibles.splice(i, 1);
            }
        }
    }

    addGround(size, color) {
        const g = new THREE.Mesh(new THREE.PlaneGeometry(size, size), new THREE.MeshStandardMaterial({ color }));
        g.rotation.x = -Math.PI / 2;
        this.scene.add(g);
        this.mapObjects.push(g);
    }

    addBox(x, y, z, w, h, d, color, isDestructible = false) {
        const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), new THREE.MeshStandardMaterial({ color }));
        m.position.set(x, y, z);
        this.scene.add(m);
        this.mapObjects.push(m);
        const box = new THREE.Box3().setFromObject(m);
        this.colliders.push(box);
        if (isDestructible) this.destructibles.push({ mesh: m, box });
    }

    addTree(x, z) {
        const t = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 1.1, 7), new THREE.MeshStandardMaterial({ color: 0x5c3a21 }));
        t.position.set(x, 3.5, z);
        const l = new THREE.Mesh(new THREE.ConeGeometry(4.5, 11, 8), new THREE.MeshStandardMaterial({ color: 0x1e4620 }));
        l.position.set(x, 10, z);
        this.scene.add(t, l);
        this.mapObjects.push(t, l);
        this.colliders.push(new THREE.Box3().setFromObject(t));
    }
}
