const evidenceCountEl = document.getElementById('evidenceCount');
const storyBox = document.getElementById('storyBox');
const choicesEl = document.getElementById('choices');
const evidenceListEl = document.getElementById('evidenceList');
const suspectListEl = document.getElementById('suspectList');
const kittyNotesEl = document.getElementById('kittyNotes');
const sceneNoteEl = document.getElementById('sceneNote');
const blurryOverlay = document.getElementById('blurryOverlay');
const hospitalOverlay = document.getElementById('hospitalOverlay');
const wakeButton = document.getElementById('wakeButton');

const state = {
  phase: 'intro',
  evidence: [],
  suspects: {
    mother: { revealed: false, clue: false },
    father: { revealed: false, clue: false },
    servant: { revealed: false, clue: false }
  },
  townTalked: false,
  codeFound: false,
  accusation: null,
  ending: null,
  kitty: 'Kitty is ready to sniff out clues.',
  hospitalMode: false
};

const suspects = {
  mother: {
    name: 'Mother',
    statement: 'She claimed she knew nothing and was too calm. Her fear came when the topic of the key appeared.'
  },
  father: {
    name: 'Father',
    statement: 'He said the victim had no enemies and looked away when the key was mentioned.'
  },
  servant: {
    name: 'Servant',
    statement: 'He admitted that the victim told him to speak to the parents, but he never did.'
  }
};

const phases = {
  intro: {
    title: 'A murder has been reported.',
    text: `Detective Anoop is called to a mansion after a wealthy man is found dead. Kitty, his clever cat partner, investigates the scene with him. This case will test his skill, patience, and instinct.`,
    choices: [{ label: 'Begin case', action: () => setPhase('scene') }]
  },
  scene: {
    title: 'Crime scene investigation',
    text: `The victim lies in a study with a knife on the floor and a piece of thread on the evidence bag. The room is too neat. Kitty begins sniffing the ceiling and the wall, as if something is hidden above them.`,
    choices: [
      { label: 'Inspect the knife', action: () => inspectKnife() },
      { label: 'Inspect the thread', action: () => inspectThread() },
      { label: 'Inspect the air bag evidence', action: () => inspectAirBag() },
      { label: 'Call Kitty to scent the room', action: () => kittySniff() },
      { label: 'Move to suspect questioning', action: () => setPhase('suspects') }
    ]
  },
  suspects: {
    title: 'Question the family and servant',
    text: 'The mother, father, and servant each give a statement. One of them is lying. One is scared. One is hiding a key and a secret.',
    choices: [
      { label: 'Question Mother', action: () => questionSuspect('mother') },
      { label: 'Question Father', action: () => questionSuspect('father') },
      { label: 'Question Servant', action: () => questionSuspect('servant') },
      { label: 'Go to town inquiry', action: () => setPhase('town') }
    ]
  },
  town: {
    title: 'Town investigation',
    text: 'The victim was known as a good man, but the family had money problems and strong tension. The servant seemed nervous at every mention of the victim’s late-night visits.',
    choices: [
      { label: 'Talk to neighbors', action: () => talkToNeighbors() },
      { label: 'Ask about the victim’s habits', action: () => askAboutVictim() },
      { label: 'Return to the house', action: () => setPhase('house') }
    ]
  },
  house: {
    title: 'Search the victim’s house',
    text: 'Inside the ceiling tile you find a piece of tape with a small brass key attached. The thread is tied around it, exactly like the thread at the crime scene.',
    choices: [
      { label: 'Inspect the hidden key', action: () => inspectCeilingKey() },
      { label: 'Question the parents about the key', action: () => questionParentsOnKey() },
      { label: 'Question the servant about the key', action: () => questionServantOnKey() },
      { label: 'Open the autopsy report', action: () => setPhase('autopsy') }
    ]
  },
  autopsy: {
    title: 'Autopsy findings',
    text: 'The victim had a stab wound and a gunshot to the head. The killer attacked first, then executed the victim. The pattern suggests panic, not spontaneous violence.',
    choices: [
      { label: 'Review all evidence', action: () => reviewEvidence() },
      { label: 'Prepare final accusation', action: () => setPhase('finale') }
    ]
  },
  finale: {
    title: 'Final confrontation',
    text: 'The killer is close. The key, thread, fiber, and statements all point to one person. You must decide who is guilty before the truth slips away.',
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

function updateSceneText(message) {
  sceneNoteEl.textContent = message;
}

function setPhase(name) {
  state.phase = name;
  const config = phases[name];
  storyBox.innerHTML = `<h3>${config.title}</h3><p>${config.text}</p>`;
  renderChoices(config.choices);
  renderSuspects();
  renderKitty();
  document.querySelectorAll('.tab').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.phase === name);
  });
}

function renderChoices(choices) {
  choicesEl.innerHTML = '';
  choices.forEach((choice) => {
    const button = document.createElement('button');
    button.className = 'choice';
    if (choice.kind) button.classList.add(choice.kind);
    button.textContent = choice.label;
    button.onclick = choice.action;
    choicesEl.appendChild(button);
  });
}

function inspectKnife() {
  addEvidence('Knife from the study');
  state.kitty = 'Kitty: The knife smell is stale. Someone handled it long after the victim fell.';
  renderKitty();
  updateSceneText('Knife found: clean handle, but hidden on purpose.');
  storyBox.innerHTML = `<h3>Knife inspection</h3><p>The blade has a smear of old blood and a wiped handle with cloth fibers. The killer attempted to clean it and hide it under a desk. It does not belong to the victim.</p>`;
  renderChoices([
    { label: 'Inspect the thread', action: () => inspectThread() },
    { label: 'Inspect the air bag evidence', action: () => inspectAirBag() },
    { label: 'Return to suspect questioning', action: () => setPhase('suspects') }
  ]);
}

function inspectThread() {
  addEvidence('Thread from the victim’s cuff');
  state.kitty = 'Kitty: The thread was tied around tape. Someone used it to hide something.';
  renderKitty();
  updateSceneText('Thread clue: tied, not random.');
  storyBox.innerHTML = `<h3>Thread clue</h3><p>The thread is not random string. It matches the cloth fibers on the victim’s cuff and was tied tightly around a hidden object. The killer had no reason to tie it unless they meant to secure or hide something.</p><p><strong>Meaning:</strong> the key was hidden using a makeshift hanger and the thread was used to keep it concealed.</p>`;
  renderChoices([
    { label: 'Inspect the hidden key', action: () => setPhase('house') },
    { label: 'Question the servant', action: () => questionSuspect('servant') },
    { label: 'Continue scene search', action: () => setPhase('scene') }
  ]);
}

function inspectAirBag() {
  addEvidence('Airbag with fabric fibers');
  state.kitty = 'Kitty: The airbag contains fibers from a servant’s uniform, not from the family.';
  renderKitty();
  updateSceneText('Airbag evidence: servant fibres recovered.');
  storyBox.innerHTML = `<h3>Evidence bag</h3><p>The air bag contains a fiber pattern from a coarse work cloth. It matches the servant’s uniform more than the family’s clothing. Someone near the victim had reason to be close enough to tamper with the scene.</p>`;
  renderChoices([
    { label: 'Question the servant', action: () => questionSuspect('servant') },
    { label: 'Question the parents', action: () => questionSuspect('mother') },
    { label: 'Return to scene', action: () => setPhase('scene') }
  ]);
}

function kittySniff() {
  state.kitty = 'Kitty: I smell smoke, fear, and a hidden metal object near the ceiling. There is a thread trace and a key pattern.';
  renderKitty();
  updateSceneText('Kitty tracks a hidden metal scent.');
  addEvidence('Kitty’s scent note');
  storyBox.innerHTML = `<h3>Kitty’s assessment</h3><p>Kitty scratches at the cracked ceiling tile and points to the upper corner. A hidden object is tucked above the room, and the scent trail points toward the servant’s side of the house. The dead man was not alone when he was killed.</p>`;
  renderChoices([
    { label: 'Search the ceiling', action: () => setPhase('house') },
    { label: 'Question suspects', action: () => setPhase('suspects') }
  ]);
}

function questionSuspect(key) {
  const suspect = suspects[key];
  state.suspects[key].revealed = true;
  state.kitty = `Kitty: The ${suspect.name.toLowerCase()} is reacting to pressure.`;
  renderKitty();

  if (key === 'mother') {
    storyBox.innerHTML = `<h3>Mother interview</h3><p>“I do not know anything,” she insists. “He had no enemies.” Her hands tremble when the victim’s room is mentioned, and her eyes keep returning to the staircase.</p><p>She is hiding something, but she may not be the killer.</p>`;
    addEvidence('Mother’s inconsistent statement');
  }

  if (key === 'father') {
    storyBox.innerHTML = `<h3>Father interview</h3><p>“The boy was troubled, not malicious,” he says, too quickly. “I would not hurt my own son.” He blinks hard when the servant is mentioned.</p><p>He knows something about the key or the secret room.</p>`;
    addEvidence('Father’s defensive answer');
  }

  if (key === 'servant') {
    storyBox.innerHTML = `<h3>Servant interview</h3><p>“He told me to tell his parents he was there,” the servant says, looking down. “But I never did. I was scared.” His eyes keep drifting upward toward the ceiling.</p><p>The servant is nervous, inconsistent, and too aware of the key.</p>`;
    addEvidence('Servant’s nervous admission');
  }

  renderChoices([
    { label: 'Continue investigating', action: () => setPhase(state.phase === 'suspects' ? 'town' : 'house') },
    { label: 'Ask another suspect', action: () => setPhase('suspects') }
  ]);
}

function talkToNeighbors() {
  state.townTalked = true;
  addEvidence('Town witness statements');
  storyBox.innerHTML = `<h3>Town inquiry</h3><p>Neighbors describe the victim as polite and generous. None of them say he had enemies. But several people speak of late-night meetings and the servant’s visible fear whenever money or the family was mentioned.</p><p>The murder was personal, not random.</p>`;
  renderChoices([
    { label: 'Return to the house', action: () => setPhase('house') },
    { label: 'Open autopsy report', action: () => setPhase('autopsy') }
  ]);
}

function askAboutVictim() {
  addEvidence('Victim’s behavior report');
  storyBox.innerHTML = `<h3>Victim profile</h3><p>He was admired by most people, but he hid deeper tensions. He had a private room, a secret key, and someone in the house who was afraid to be questioned about him. It was not a random murder.</p>`;
  renderChoices([
    { label: 'Return to the house', action: () => setPhase('house') },
    { label: 'Question the servant', action: () => questionSuspect('servant') }
  ]);
}

function inspectCeilingKey() {
  state.codeFound = true;
  addEvidence('Hidden brass key tied with thread');
  state.kitty = 'Kitty: This key matches a lockbox in the servant’s room. The thread is the same one from the scene.';
  renderKitty();
  updateSceneText('Ceiling key recovered.');
  storyBox.innerHTML = `<h3>Hidden key</h3><p>Under the cracked ceiling tile is a piece of tape tied with the same thread from the crime scene. Attached to it is a brass key. The key was hidden in plain sight. It belonged to someone who feared the family would find it.</p><p>The killer or their accomplice hid it here.</p>`;
  renderChoices([
    { label: 'Question the parents about the key', action: () => questionParentsOnKey() },
    { label: 'Question the servant about the key', action: () => questionServantOnKey() },
    { label: 'Open the autopsy report', action: () => setPhase('autopsy') }
  ]);
}

function questionParentsOnKey() {
  storyBox.innerHTML = `<h3>Parents questioned</h3><p>“That key is not ours,” the mother says. The father immediately turns away and looks terrified. They both hide something else. The key seems to belong to the servant, or to a secret the household wanted buried.</p><p>The key is the missing link. It connects the servant to the victim and the ceiling hiding place.</p>`;
  addEvidence('Parents deny knowledge of the key');
  renderChoices([
    { label: 'Question the servant', action: () => questionServantOnKey() },
    { label: 'Continue to autopsy', action: () => setPhase('autopsy') }
  ]);
}

function questionServantOnKey() {
  storyBox.innerHTML = `<h3>Servant admits the key</h3><p>“It was my key,” the servant says. “The victim gave it to me for safe keeping. He asked me to keep it hidden because he feared the family would take it from him.” He avoids eye contact when the thread is mentioned.</p><p>That is the moment the case becomes clear. The servant was part of the secret, and the hidden key was used as a cover to keep the truth from the family.</p>`;
  addEvidence('Servant admits the key belonged to him');
  renderChoices([
    { label: 'Review the full case', action: () => reviewEvidence() },
    { label: 'Move to final accusation', action: () => setPhase('finale') }
  ]);
}

function reviewEvidence() {
  const evidenceSummary = [
    'Knife was wiped and hidden',
    'Thread was from the victim’s cuff and tied around the key',
    'Airbag fibers match the servant’s uniform',
    'Key was hidden in the ceiling and belonged to the servant',
    'Parents gave inconsistent stories',
    'Autopsy proves a stab and fatal gunshot',
    'Town witnesses reveal hidden family tension'
  ];

  storyBox.innerHTML = `<h3>Case review</h3><p>Every clue points to a single conclusion: the servant had access, the thread hid the key, and the family had already begun to cover the truth. The murder was personal and deliberate.</p><ul>${evidenceSummary.map((item) => '<li>' + item + '</li>').join('')}</ul>`;
  renderChoices([
    { label: 'Prepare final accusation', action: () => setPhase('finale') }
  ]);
}

function triggerBlurryHit() {
  blurryOverlay.classList.remove('hidden');
  setTimeout(() => {
    blurryOverlay.classList.add('hidden');
    hospitalOverlay.classList.remove('hidden');
  }, 1800);
}

function accuse(suspectKey) {
  state.accusation = suspectKey;

  if (suspectKey === 'servant') {
    storyBox.innerHTML = `<h3>Case solved</h3><p>You confront the servant. He cracks: he says the victim discovered the family’s secret and demanded money. He stabbed the victim in a panic, then shot him in the head to finish it before the parents could react. He hid the key to keep the evidence away from the police and from the family.</p><p>As the room erupts in panic, the mother swings a baseball bat in desperation. It cracks against your temple. Your vision turns into a blur — the world screams and fades out.</p><p>Then everything goes black.</p>`;
    state.ending = 'win';
    renderChoices([{ label: 'Continue', action: () => triggerBlurryHit() }]);
    updateSceneText('The killer strikes. The screen blurs.');
    return;
  }

  storyBox.innerHTML = `<h3>Wrong accusation</h3><p>It is a mistake. The family is not the killer. You are too late to stop the servant. The mother swings in panic, and with a flash of pain and light, everything goes dark.</p><p>It was too late to fix the case, and the truth slips away before the police can arrive.</p>`;
  state.ending = 'loss';
  renderChoices([{ label: 'Wake up and restart the case', action: () => triggerBlurryHit() }]);
  updateSceneText('Wrong accusation. The killer strikes.');
}

wakeButton.addEventListener('click', () => {
  hospitalOverlay.classList.add('hidden');
  storyBox.innerHTML = `<h3>Hospital recovery</h3><p>You wake up in a white room with a bandaged head and a growing sense of urgency. Kitty is waiting at the foot of your bed, eyes sharp and alert.</p><p>A police officer enters with a sealed file. “We got your letter,” she says. “The servant confessed. The thread and the key were the missing link.”</p><p>You are discharged the next morning, but the city is still watching. The case is solved, and the next chapter begins.</p><p><strong>Case status: solved and closed.</strong></p>`;
  renderChoices([{ label: 'Restart case', action: () => resetCase() }]);
});

function resetCase() {
  state.evidence = [];
  state.phase = 'intro';
  state.ending = null;
  state.accusation = null;
  state.codeFound = false;
  state.kitty = 'Kitty is ready to sniff out clues.';
  evidenceCountEl.textContent = '0';
  setPhase('intro');
  renderEvidence();
  renderKitty();
}

renderEvidence();
renderSuspects();
renderKitty();
setPhase('intro');
