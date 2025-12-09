import { Midi } from "@tonejs/midi";

function normalizeVelocities(tracks, targetVolume) {
    let velocities = [];
    tracks.forEach(track => track.notes.forEach(note => velocities.push(note.velocity)));

    if (velocities.length === 0) return;

    const minV = Math.min(...velocities);
    const maxV = Math.max(...velocities);
    const range = maxV - minV;

    tracks.forEach(track => {
        track.notes.forEach(note => {
            // Normalize to 0-1, then scale by targetVolume
            const normalized = range > 0 ? (note.velocity - minV) / range : 1;
            note.velocity = Math.min(normalized * (targetVolume / 127), 1);
        });
    });
}

function scaleVelocities(tracks, volume) {
    const scale = Math.min(volume / 127, 1);
    tracks.forEach(track => {
        track.notes.forEach(note => {
            note.velocity = Math.min(note.velocity * scale, 1);
        });
    });
}

export async function processMidiFile(file, normalize = true, volume = 200) {
    const arrayBuffer = await file.arrayBuffer();
    const midi = new Midi(arrayBuffer);

    if (normalize) {
        normalizeVelocities(midi.tracks, volume);
    } else {
        scaleVelocities(midi.tracks, volume);
    }

    const output = midi.toArray();
    return new Blob([output], { type: "audio/midi" });
}

export function initMidiProcessor(dropZone, getOptions) {
    dropZone.addEventListener("dragover", e => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "copy";
    });

    dropZone.addEventListener("drop", async e => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files).filter(f =>
            f.name.endsWith(".mid") || f.name.endsWith(".midi")
        );
        if (!files.length) return;

        const { normalize, volume } = getOptions();

        for (const file of files) {
            const processedBlob = await processMidiFile(file, normalize, volume);

            // Trigger download
            const a = document.createElement("a");
            a.href = URL.createObjectURL(processedBlob);
            a.download = file.name.replace(/\.mid|\.midi/i, "") + "-loud.mid";
            document.body.appendChild(a);
            a.click();
            a.remove();
        }
    });
}
