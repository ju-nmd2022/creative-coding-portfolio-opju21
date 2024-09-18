let player;
let oscillator;
let analyser;
let mic;

window.addEventListener("load", () => {
  player = new Tone.Player("path/to/your/file.mp3");
  oscillator = new Tone.Oscillator(440, "sine").toDestination();

  analyser = new Tone.Analyser("fft", 4096);

  mic = new Tone.UserMedia();

  oscillator.connect(analyser);
  oscillator.toDestination();
  player.connect(analyser);
  player.toDestination();
  mic.connect(analyser);
});

window.addEventListener("click", () => {
  // player.start();
  oscillator.start();
  // mic.open();
});

function setup() {
  createCanvas(innerWidth, innerHeight);
}

function draw() {
  background(255, 255, 255);
  let value = analyser.getValue();
  for (let i = 0; i < value.length; i++) {
    let v = map(value[i], -100, 0, height, 0);
    rect(i * 1, 0, 1, v); // waveform: * 100
  }
}

/*
array of amplitudes and each element of the array basically represents a range of frequencies. The size of each range is defined by the sample rate divided by the number of FFT points, 64 in your case. So if your sample rate was 48000 and your FFT size is 64 then each element covers a range of 48000/64 = 750 Hz. That means frequencyData[0] are the frequencies 0Hz-750Hz, frequencyData[1] is 750Hz-1500Hz, and so on. In this example the presence of a 1kHz tone would be seen as a peak in the first bin. Also, with such a small FFT you probably noticed that the resolution is very coarse. If you want to increase the frequency resolution you'll need to do a larger FFT.
*/
