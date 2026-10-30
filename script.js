const evidenceCountEl = document.getElementById('evidenceCount');
const storyBox = document.getElementById('storyBox');
const choicesEl = document.getElementById('choices');
const evidenceListEl = document.getElementById('evidenceList');
const suspectListEl = document.getElementById('suspectList');
const kittyNotesEl = document.getElementById('kittyNotes');
const sceneNoteEl = document.getElementById('sceneNote');
const blurScreen = document.getElementById('blurScreen');
const hospitalOverlay = document.getElementById('hospitalOverlay');
const wakeButton = document.getElementById('wakeButton');

const state = {
  phase: 'intro',
  evidence: [],
  kitty: 'Kitty is ready to sniff out clues.',
  ending: null,
  accusation: null,
  townTalked: false
};

const suspects = {
  mother: {
    name: 'Mother',
    statement: 'She said she knew nothing and looked too calm. Her panic started when the key was mentioned.'
  },
  father: {
    name: 'Father',
    statement: 'He claimed there were no enemies, but his expression broke whenever the servant was discussed.'
  },
  servant: {
    name: 'Servant',
    statement: 'He admitted he was told to speak to the parents, but never did. His story was full of fear.'
  }
};

const phaseData = {
  intro: {
    title: 'Case Start',
    text: 'Detective Anoop is called to Thornfield Manor after a wealthy man is found dead. With his cat partner Kitty beside him, he begins the first real investigation. The murder scene is messy in a way that suggests hidden logic, not chaos. The puzzle begins with a knife, a thread, and a hidden key.',
    choices: [{ label: 'Open the case file', action: () => setPhase('scene') }]
  },
  scene: {
    title: 'Crime Scene',
    text: 'The victim lies in the study with a knife on the floor and a piece of thread wrapped inside an evidence bag. Kitty immediately sniffs the ceiling, as if there is something hidden above the room. There is a smell of smoke, old fear, and metal.',
    choices: [
      { label: 'Inspect the knife', action: () => inspectKnife() },
      { label: 'Inspect the thread', action: () => inspectThread() },
      { label: 'Inspect the air bag', action: () => inspectAirBag() },
      { label: 'Get Kitty’s clue', action: () => kittySniff() },
      { label: 'Question the family', action: () => setPhase('suspects') }
    ]
  },
  suspects: {
    title: 'Suspect Interviews',
    text: 'The mother is calm but hiding fear. The father is defensive. The servant is nervous and evasive. One of them is lying. One of them is hiding the key. One of them is the killer.',
    choices: [
      { label: 'Question Mother', action: () => questionSuspect('mother') },
      { label: 'Question Father', action: () => questionSuspect('father') },
      { label: 'Question Servant', action: () => questionSuspect('servant') },
      { label: 'Visit the town', action: () => setPhase('town') }
    ]
  },
  town: {
    title: 'Town Investigation',
    text: 'The town paints the victim as polite and admired, but the servant is repeatedly described as nervous. There are whispers about late-night meetings and family money problems. This murder is not random. It is personal.',
    choices: [
      { label: 'Talk to neighbors', action: () => talkToNeighbors() },
      { label: 'Ask about the victim', action: () => askAboutVictim() },
      { label: 'Return to the house', action: () => setPhase('house') }
    ]
  },
  house: {
    title: 'Search the House',
    text: 'With Kitty guiding the search, Anoop finds a taped brass key hidden in the cracked ceiling tile. The thread around it is the same thread from the murder scene. This is deliberate concealment — not luck. The killer hid the key there.',
    choices: [
      { label: 'Inspect the hidden key', action: () => inspectCeilingKey() },
      { label: 'Question parents', action: () => questionParentsOnKey() },
      { label: 'Question servant', action: () => questionServantOnKey() },
      { label: 'Open autopsy', action: () => setPhase('autopsy') }
    ]
  },
  autopsy: {
    title: 'Autopsy',
    text: 'The postmortem confirms a stab wound and a gunshot to the head. The killer struck first then finished the victim with a gunshot. That means there was panic, not a spontaneous fight. The killer wanted to hide the truth and leave a confused scene.',
    choices: [
      { label: 'Review all evidence', action: () => reviewEvidence() },
      { label: 'Prepare final accusation', action: () => setPhase('finale') }
    ]
  },
  finale: {
    title: 'Final Confrontation',
    text: 'The key, the thread, the fibers, and the lies all point in one direction. The final accusation must be made before the killer strikes again.',
    choices: [
      { label: 'Accuse the servant', action: () => accuse('servant') },
      { label: 'Accuse the mother', action: () => accuse('mother') },
      { label: 'Accuse the father', action: () => accuse('father') }
    ]
  }
};

function addEvidence(name) {
  if (!state.evidence.includes(name)) {
    state.evidence.push(name);
    evidenceCountEl.textContent = String(state.evidence.length);
    renderEvidence();
  }
}

function renderEvidence() {
  evidenceListEl.innerHTML = '';
  state.evidence.forEach((item) => {
    const div = document.createElement('div');
    div.className = 'evidence-item';
    div.textContent = item;
    evidenceListEl.appendChild(div);
  });
}

function renderSuspects() {
  suspectListEl.innerHTML = '';
  Object.entries(suspects).forEach(([key, value]) => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${value.name}</strong>${value.statement}`;
    suspectListEl.appendChild(li);
  });
}

function renderKitty() {
  kittyNotesEl.textContent = state.kitty;
}

function setPhase(name) {
  state.phase = name;
  const cfg = phaseData[name];
  storyBox.innerHTML = `<h3>${cfg.title}</h3><p>${cfg.text}</p>`;
  renderChoices(cfg.choices);
  renderSuspects();
  renderKitty();
  document.querySelectorAll('.tab').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.phase === name);
  });
  updateSceneText(name === 'scene' ? 'The crime is waiting.' : 'The investigation continues.');
}

function renderChoices(choices) {
  choicesEl.innerHTML = '';
  choices.forEach((choice) => {
    const btn = document.createElement('button');
    btn.className = 'choice';
    if (choice.kind) btn.classList.add(choice.kind);
    btn.textContent = choice.label;
    btn.onclick = choice.action;
    choicesEl.appendChild(btn);
  });
}

function updateSceneText(text) {
  sceneNoteEl.textContent = text;
}

function inspectKnife() {
  addEvidence('Knife from the study');
  state.kitty = 'Kitty: This knife was wiped, then hidden. Someone wanted the scene to look accidental.';
  renderKitty();
  updateSceneText('Knife found: hidden, wiped, and deliberate.');
  storyBox.innerHTML = `<h3>Knife inspection</h3><p>The knife is not random. It has old blood under the blade and cloth fibers on the handle. Someone tried to clean it before they hid it under the desk. That means the killer was trying to erase their trail.</p>`;
  renderChoices([
    { label: 'Inspect the thread', action: () => inspectThread() },
    { label: 'Inspect the air bag', action: () => inspectAirBag() },
    { label: 'Question suspects', action: () => setPhase('suspects') }
  ]);
}

function inspectThread() {
  addEvidence('Thread from the victim’s cuff');
  state.kitty = 'Kitty: The thread is tied, not loose. It was used to secure something.';
  renderKitty();
  updateSceneText('Thread clue: it was used to hide something.');
  storyBox.innerHTML = `<h3>Thread clue</h3><p>The thread is not stray fabric. It matches the victim’s cuff and was knotted tight around a hidden object. That means the killer used it to secure or conceal a key — and they did it deliberately.</p><p><strong>Meaning:</strong> the hidden key was placed in the ceiling and tied with thread so it could not be easily found.</p>`;
  renderChoices([
    { label: 'Search the ceiling', action: () => setPhase('house') },
    { label: 'Question the servant', action: () => questionSuspect('servant') },
    { label: 'Continue searching the scene', action: () => setPhase('scene') }
  ]);
}

function inspectAirBag() {
  addEvidence('Airbag with fabric fibers');
  state.kitty = 'Kitty: The fibers match the servant’s coarse uniform, not the family’s clothes.';
  renderKitty();
  updateSceneText('Airbag evidence: servant fibers found.');
  storyBox.innerHTML = `<h3>Airbag evidence</h3><p>The air bag contains threads from a coarse work uniform. It matches the servant’s clothes more than the family’s expensive garments. Someone near the victim was close enough to tamper with the evidence and hide a key.</p>`;
  renderChoices([
    { label: 'Question the servant', action: () => questionSuspect('servant') },
    { label: 'Question the mother', action: () => questionSuspect('mother') },
    { label: 'Return to crime scene', action: () => setPhase('scene') }
  ]);
}

function kittySniff() {
  state.kitty = 'Kitty: I smell old smoke, fear, and a hidden metal object near the ceiling. There is thread and a key pattern. The truth is above you.';
  renderKitty();
  updateSceneText('Kitty tracks the hidden clue.');
  addEvidence('Kitty’s scent note');
  storyBox.innerHTML = `<h3>Kitty’s clue</h3><p>Kitty scratches repeatedly at a cracked ceiling tile and refuses to leave it. The scent trail points toward the hidden key and the servant’s side of the house. The victim was not killed in isolation — someone close to him hid this evidence.</p>`;
  renderChoices([
    { label: 'Search the ceiling', action: () => setPhase('house') },
    { label: 'Question suspects', action: () => setPhase('suspects') }
  ]);
}

function questionSuspect(key) {
  const su = suspects[key];
  state.kitty = `Kitty: The ${su.name.toLowerCase()} is guarding a lie.`;
  renderKitty();

  if (key === 'mother') {
    storyBox.innerHTML = `<h3>Mother interview</h3><p>“I know nothing,” she says. Her words are calm, but her hands shake when the victim’s room is mentioned. Her eyes keep returning to the staircase, and her voice changes whenever the key is brought up.</p><p>She is not necessarily the killer, but she is hiding something.</p>`;
    addEvidence('Mother’s inconsistent statement');
  }

  if (key === 'father') {
    storyBox.innerHTML = `<h3>Father interview</h3><p>“He had no enemies,” the father says too quickly. “He was not a threat.” His eyes drift away the moment the servant’s name is mentioned, and he recoils from the question about the key.</p><p>He knows more than he is saying.</p>`;
    addEvidence('Father’s defensive answer');
  }

  if (key === 'servant') {
    storyBox.innerHTML = `<h3>Servant interview</h3><p>“He told me to tell his parents he was there,” the servant whispers. “But I never did.” He keeps looking toward the ceiling and refuses to meet Anoop’s eyes. His fear is too raw to be an accident.</p><p>He knows exactly what is hidden.</p>`;
    addEvidence('Servant’s nervous admission');
  }

  renderChoices([
    { label: 'Move to town', action: () => setPhase('town') },
    { label: 'Ask another suspect', action: () => setPhase('suspects') }
  ]);
}

function talkToNeighbors() {
  addEvidence('Town witness statements');
  state.townTalked = true;
  storyBox.innerHTML = `<h3>Town inquiry</h3><p>Neighbors call the victim polite and generous, but they also whisper about family stress and the servant’s visible fear whenever money or late-night visits were mentioned. There were no enemies, yet there was obvious tension. This was not a random murder — it was personal and private.</p>`;
  renderChoices([
    { label: 'Return to the house', action: () => setPhase('house') },
    { label: 'Open autopsy', action: () => setPhase('autopsy') }
  ]);
}

function askAboutVictim() {
  addEvidence('Victim behavior report');
  storyBox.innerHTML = `<h3>Victim profile</h3><p>The victim was respected by many, but he kept private matters hidden. He had a secret key, a private room, and a late-night routine that made the servant nervous. The culprit was someone who knew his habits and timing.</p>`;
  renderChoices([
    { label: 'Return to house', action: () => setPhase('house') },
    { label: 'Question the servant', action: () => questionSuspect('servant') }
  ]);
}

function inspectCeilingKey() {
  addEvidence('Hidden brass key tied with thread');
  state.kitty = 'Kitty: This key matches a lockbox or hidden compartment. The thread is the same as the one from the crime scene.';
  renderKitty();
  updateSceneText('Brass key recovered from the ceiling.');
  storyBox.innerHTML = `<h3>Hidden key</h3><p>In the cracked ceiling tile, Anoop finds tape wrapped around a brass key. The same thread used in the crime scene is tied around it. This was hidden deliberately — and it has been waiting for someone to find it.</p><p>The culprit wanted the key to stay out of sight, away from the parents and away from the police.</p>`;
  renderChoices([
    { label: 'Question the parents', action: () => questionParentsOnKey() },
    { label: 'Question the servant', action: () => questionServantOnKey() },
    { label: 'Open autopsy', action: () => setPhase('autopsy') }
  ]);
}

function questionParentsOnKey() {
  storyBox.innerHTML = `<h3>Parents questioned</h3><p>“That key is not ours,” the mother says. The father turns away, pale and tense. The answer is too quick and too rehearsed. Both of them know the key is connected to a hidden secret — and the servant is at the center of it.</p>`;
  addEvidence('Parents deny knowledge of the key');
  renderChoices([
    { label: 'Question the servant', action: () => questionServantOnKey() },
    { label: 'Open autopsy', action: () => setPhase('autopsy') }
  ]);
}

function questionServantOnKey() {
  storyBox.innerHTML = `<h3>Servant confessing</h3><p>“It was my key,” the servant says. “The victim gave it to me for safe keeping. He told me to keep it hidden because he feared the family would take it from him.” He does not look up. The thread, the key, and the fibers finally connect.</p><p><strong>The case now points to the servant.</strong></p>`;
  addEvidence('Servant admits key belonged to him');
  renderChoices([
    { label: 'Review all evidence', action: () => reviewEvidence() },
    { label: 'Prepare final accusation', action: () => setPhase('finale') }
  ]);
}

function reviewEvidence() {
  const list = [
    'Knife was wiped and hidden',
    'Thread was tied around the hidden brass key',
    'Airbag fibers matched the servant’s uniform',
    'Key was hidden in the ceiling tile',
    'Parents gave conflicting stories',
    'Autopsy proves a stab wound and gunshot to the head',
    'Town witnesses report family tension and servant fear'
  ];

  storyBox.innerHTML = `<h3>Case Review</h3><p>Everything fits together. The servant had access to the victim, the key, and the secret room. The thread is the proof that the clue was intentionally hidden. He planned the concealment and he knew the family would panic if the truth came out.</p><ul>${list.map((item) => '<li>' + item + '</li>').join('')}</ul>`;
  renderChoices([{ label: 'Prepare final accusation', action: () => setPhase('finale') }]);
}

function triggerBlurThenHospital() {
  blurScreen.classList.remove('hidden');
  setTimeout(() => {
    blurScreen.classList.add('hidden');
    hospitalOverlay.classList.remove('hidden');
  }, 1500);
}

function accuse(suspectKey) {
  state.accusation = suspectKey;

  if (suspectKey === 'servant') {
    storyBox.innerHTML = `<h3>Case solved</h3><p>You confront the servant. He cracks under pressure. He admits the victim found out about the family’s secret and demanded money. The servant stabbed him in a panic and then shot him in the head to finish the act. He hid the key and thread to keep the truth from the police.</p><p>The family erupts into panic. The mother swings a baseball bat in desperation. You duck, but the blow lands hard. The room spins. The world breaks into a blur.</p><p>Then everything goes black.</p>`;
    state.ending = 'win';
    renderChoices([{ label: 'Continue', action: () => triggerBlurThenHospital() }]);
    updateSceneText('The killer strikes. The scene is blurring.');
    return;
  }

  storyBox.innerHTML = `<h3>Wrong accusation</h3><p>You accuse the wrong person. The room erupts in confusion. The mother lashes out in panic and hits you with a baseball bat. The world flashes white, then dark. The case slips away again.</p><p>The city moves on. The killer remains hidden. The next move will have to come from a hospital bed.</p>`;
  state.ending = 'loss';
  renderChoices([{ label: 'Wake up and restart the case', action: () => triggerBlurThenHospital() }]);
  updateSceneText('Wrong accusation. The killer strikes again.');
}

wakeButton.addEventListener('click', () => {
  hospitalOverlay.classList.add('hidden');
  storyBox.innerHTML = `<h3>Hospital recovery</h3><p>You wake up bandaged and exhausted in a hospital room. Kitty is on the chair beside your bed, ears tilted, eyes steady and alive. The police officer entering with a sealed file says the letter you sent them was enough.</p><p>“The servant confessed,” she says. “The thread and key exposed the lie.”</p><p>You leave the hospital the next day, the city behind you, but the case is solved. The truth survived. Kitty stays at your side, as quiet as a warning and as loyal as ever.</p><p><strong>Case status: solved and closed.</strong></p>`;
  renderChoices([{ label: 'Restart the case', action: () => resetCase() }]);
});

function resetCase() {
  state.evidence = [];
  state.phase = 'intro';
  state.ending = null;
  state.accusation = null;
  state.kitty = 'Kitty is ready to sniff out clues.';
  evidenceCountEl.textContent = '0';
  renderEvidence();
  renderKitty();
  setPhase('intro');
}

renderEvidence();
renderSuspects();
renderKitty();
setPhase('intro');
