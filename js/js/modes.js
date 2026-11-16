export class GameModeManager {
    constructor(scene, alertCallback, onMatchEnd) {
        this.scene = scene;
        this.alert = alertCallback;
        this.onMatchEnd = onMatchEnd;
        this.mode = 'warmup';
        this.timer = 240;
        this.stormRadius = 720;
        this.spikePlanted = false;
        this.spikeTimer = 40;
        this.loots = [];
        this.scoreAttackers = 0;
        this.scoreDefenders = 0;
        this.roundNum = 1;
        this.siteAPos = new THREE.Vector3(-65, 0, -45);
        this.siteBPos = new THREE.Vector3(65, 0, -45);
        this.extractPos = new THREE.Vector3(0, 0, -320);
        this.extractHoldTime = 0;
        this.matchEnded = false;
    }

    setup(mode, mapBuilder) {
        this.mode = mode;
        this.matchEnded = false;
        document.getElementById('hud-mode').innerText = mode.toUpperCase();
        document.getElementById('ability-bar').classList.toggle('hidden', mode !== 'valorant');

        if (mode === 'extraction') {
            this.extractPos.copy(mapBuilder.extractPos);
            this.extractZone = new THREE.Mesh(
                new THREE.CylinderGeometry(12, 12, 40, 32, 1, true),
                new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.3, side: THREE.DoubleSide })
            );
            this.extractZone.position.set(this.extractPos.x, 20, this.extractPos.z);
            this.scene.add(this.extractZone);

            const itemPool = [
                { id: 'medkit', name: 'Tactical Medkit (+60 HP)', color: 0xff3333, value: 400 },
                { id: 'bandage', name: 'Duck Bandage (+25 HP)', color: 0xffffff, value: 150 },
                { id: 'gold', name: 'Golden Egg ($1000)', color: 0xffd700, value: 1000 }
            ];
            for (let i = 0; i < 45; i++) {
                const item = itemPool[i % itemPool.length];
                const crate = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.5, 1.5), new THREE.MeshStandardMaterial({ color: item.color }));
                crate.position.set((Math.random() - 0.5) * 700, 0.75, (Math.random() - 0.5) * 700);
                crate.userData = item;
                this.scene.add(crate);
                this.loots.push(crate);
            }
        } 
        else if (mode === 'br100') {
            this.stormRadius = 720;
            this.stormMesh = new THREE.Mesh(
                new THREE.CylinderGeometry(this.stormRadius, this.stormRadius, 90, 64, 1, true),
                new THREE.MeshBasicMaterial({ color: 0x8a2be2, transparent: true, opacity: 0.35, side: THREE.DoubleSide })
            );
            this.stormMesh.position.y = 45;
            this.scene.add(this.stormMesh);
        } 
        else if (mode === 'valorant') {
            this.siteAPos.copy(mapBuilder.siteA);
            this.siteBPos.copy(mapBuilder.siteB);
            this.timer = 100;
            this.spikePlanted = false;

            const ringGeo = new THREE.RingGeometry(6, 8, 32);
            this.meshA = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({ color: 0xff3333, side: THREE.DoubleSide }));
            this.meshA.rotation.x = -Math.PI / 2;
            this.meshA.position.set(this.siteAPos.x, 0.1, this.siteAPos.z);

            this.meshB = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({ color: 0x3b82f6, side: THREE.DoubleSide }));
            this.meshB.rotation.x = -Math.PI / 2;
            this.meshB.position.set(this.siteBPos.x, 0.1, this.siteBPos.z);

            this.scene.add(this.meshA, this.meshB);
            this.updateValorantScoreHUD();
        }
    }

    updateValorantScoreHUD() {
        document.getElementById('hud-score').innerText = `ATK ${this.scoreAttackers} - ${this.scoreDefenders} DEF (R${this.roundNum})`;
    }

    resetValorantRound(onRoundReset) {
        if (this.scoreAttackers >= 5 || this.scoreDefenders >= 5) {
            this.matchEnded = true;
            const won = this.scoreAttackers >= 5;
            this.onMatchEnd(won ? 'VICTORY!' : 'DEFEAT', `Final Score: ${this.scoreAttackers} - ${this.scoreDefenders}`, won);
            return;
        }
        this.roundNum++;
        this.timer = 100;
        this.spikePlanted = false;
        this.spikeTimer = 40;
        this.updateValorantScoreHUD();
        onRoundReset();
    }

    update(delta, playerPos, takeDamage, addItemToInventory, cash, plantKey, onRoundReset, isInBus) {
        if (this.mode === 'warmup' || this.matchEnded) return;
        this.timer -= delta;
        document.getElementById('hud-timer').innerText = Math.max(0, Math.ceil(this.timer)) + 's';

        if (this.mode === 'extraction') {
            for (let i = this.loots.length - 1; i >= 0; i--) {
                this.loots[i].rotation.y += delta * 2;
                if (playerPos.distanceTo(this.loots[i].position) < 3.2) {
                    addItemToInventory(this.loots[i].userData);
                    this.scene.remove(this.loots[i]);
                    this.loots.splice(i, 1);
                }
            }
            const dist = new THREE.Vector2(playerPos.x, playerPos.z).distanceTo(new THREE.Vector2(this.extractPos.x, this.extractPos.z));
            if (dist < 12) {
                this.extractHoldTime += delta;
                this.alert(`EXTRACTING IN ${(3 - this.extractHoldTime).toFixed(1)}s...`);
                if (this.extractHoldTime >= 3) {
                    this.matchEnded = true;
                    this.onMatchEnd('EXTRACTED SAFELY!', 'All looted weapons and cash saved to Stash!', true);
                }
            } else {
                this.extractHoldTime = 0;
                this.alert(`Extract Beacon at (${Math.round(this.extractPos.x)}, ${Math.round(this.extractPos.z)})`);
            }
        } 
        else if (this.mode === 'br100') {
            if (isInBus) return;
            if (this.stormRadius > 15) {
                this.stormRadius -= 4.5 * delta;
                this.stormMesh.scale.set(this.stormRadius / 720, 1, this.stormRadius / 720);
            }
            if (Math.hypot(playerPos.x, playerPos.z) > this.stormRadius) {
                this.alert('OUTSIDE SAFE ZONE! TAKING STORM DAMAGE!');
                takeDamage(12 * delta);
            } else {
                this.alert(`100-Duck BR | Safe Zone Radius: ${Math.floor(this.stormRadius)}m`);
            }
        } 
        else if (this.mode === 'valorant') {
            if (this.spikePlanted) {
                this.spikeTimer -= delta;
                this.alert(`SPIKE PLANTED! DETONATION IN ${Math.ceil(this.spikeTimer)}s`);
                if (this.spikeTimer <= 0) {
                    this.scoreAttackers++;
                    this.resetValorantRound(onRoundReset);
                }
            } else {
                this.alert(`[Q/C/X] Agent Abilities | [B] Armory | [${plantKey.replace('Key', '')}] Plant Spike`);
                if (this.timer <= 0) {
                    this.scoreDefenders++;
                    this.resetValorantRound(onRoundReset);
                }
            }
        }
    }

    plantSpike(playerPos) {
        if (this.mode === 'valorant' && !this.spikePlanted) {
            const dA = new THREE.Vector2(playerPos.x, playerPos.z).distanceTo(new THREE.Vector2(this.siteAPos.x, this.siteAPos.z));
            const dB = new THREE.Vector2(playerPos.x, playerPos.z).distanceTo(new THREE.Vector2(this.siteBPos.x, this.siteBPos.z));
            if (dA < 8 || dB < 8) this.spikePlanted = true;
        }
    }
}
