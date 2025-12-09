(() => {
    function normalizeVelocities(tracks, targetVolume) {
        let velocities = [];
        tracks.forEach(track => track.notes.forEach(note => velocities.push(note.velocity)));

        if (!velocities.length) return;

        const minV = Math.min(...velocities);
        const maxV = Math.max(...velocities);
        const range = maxV - minV;

        tracks.forEach(track =>
            track.notes.forEach(note => {
                const normalized = range > 0 ? (note.velocity - minV) / range : 1;
                note.velocity = Math.min(Math.round(normalized * targetVolume), 127);
            })
        );
    }

    function scaleVelocities(tracks, volume) {
        const scale = Math.min(volume / 127, 1);
        tracks.forEach(track =>
            track.notes.forEach(note => {
                note.velocity = Math.min(Math.round(note.velocity * scale), 127);
            })
        );
    }

    async function processMidiFile(file, normalize, volume) {
        const arrayBuffer = await file.arrayBuffer();
        const midi = new window.Midi(arrayBuffer);

        if (normalize) {
            normalizeVelocities(midi.tracks, volume);
        } else {
            scaleVelocities(midi.tracks, volume);
        }

        const output = midi.toArray();
        return new Blob([output], { type: "audio/midi" });
    }

    function initMidiProcessor(dropZone, getOptions) {
        dropZone.addEventListener("dragover", e => {
            e.preventDefault();
            e.dataTransfer.dropEffect = "copy";
        });

        dropZone.addEventListener("drop", async e => {
            e.preventDefault();
            const files = Array.from(e.dataTransfer.files).filter(f =>
                f.name.toLowerCase().endsWith(".mid") || f.name.toLowerCase().endsWith(".midi")
            );
            if (!files.length) return;

            const { normalize, volume } = getOptions();

            for (const file of files) {
                const processedBlob = await processMidiFile(file, normalize, volume);
                const a = document.createElement("a");
                a.href = URL.createObjectURL(processedBlob);
                a.download = file.name.replace(/\.mid|\.midi/i, "") + "-loud.mid";
                document.body.appendChild(a);
                a.click();
                a.remove();
            }
        });
    }

    document.addEventListener("DOMContentLoaded", () => {
        initMidiProcessor(document.body, () => ({
            normalize: document.getElementById('normalize').checked,
            volume: parseInt(document.getElementById('volume').value) || 127
        }));
    });

})();
