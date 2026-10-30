const evidenceCountEl = document.getElementById('evidenceCount');
const storyBox = document.getElementById('storyBox');
const choicesEl = document.getElementById('choices');
const evidenceListEl = document.getElementById('evidenceList');
const suspectListEl = document.getElementById('suspectList');
const kittyNotesEl = document.getElementById('kittyNotes');
const sceneNoteEl = document.getElementById('sceneNote');

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
  kitty: 'Kitty is ready to sniff out clues.'
};

const suspects = {
  mother: {
    name: 'Mother',
    statement: 'She said she knew nothing and seemed too calm, but she was hiding panic.'
  },
  father: {
    name: 'Father',
    statement: 'He said the victim was not close to him and looked away when the key was mentioned.'
  },
  servant: {
    name: 'Servant',
    statement: 'He admitted the victim had told him to tell the parents he was in the study, but he never did.'
  }
};

const phases = {
  intro: {
    title: 'A murder has been reported.',
    text: `Detective Anoop is called to a luxury house after a wealthy man is found dead. His cat, Kitty, is with him as a forensic hound. Given the evidence, this case will test whether you can read a lie, track a hidden thread, and uncover the truth before the killer turns on you.`,
    choices: [
      { label: 'Begin case', action: () => setPhase('scene') }
    ]
  },
  scene: {
    title: 'Crime scene investigation',
    text: `The dead man lies in a study with a knife on the floor and a piece of thread on the evidence bag. The scene is too neat. There is a strong smell of smoke and a line of threads near the wall. Kitty begins sniffing around the body and the ceiling.`,
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
    text: 'Each person gives a statement. One of them is defensive. Another is hiding something. One is waiting to see whether you suspect the wrong person.',
    choices: [
      { label: 'Question Mother', action: () => questionSuspect('mother') },
      { label: 'Question Father', action: () => questionSuspect('father') },
      { label: 'Question Servant', action: () => questionSuspect('servant') },
      { label: 'Go to town inquiry', action: () => setPhase('town') }
    ]
  },
  town: {
    title: 'Town investigation',
    text: 'The town is full of quiet rumors. The victim was said to be kind, but behind closed doors there were money issues, family tension, and nerves from the servant.',
    choices: [
      { label: 'Talk to neighbors', action: () => talkToNeighbors() },
      { label: 'Ask about the victim’s habits', action: () => askAboutVictim() },
      { label: 'Return to the house', action: () => setPhase('house') }
    ]
  },
  house: {
    title: 'Search the victim’s house',
    text: 'You search every room, and in a cracked ceiling tile you find a piece of tape with a small brass key tied to it. The tape has been hidden in plain sight.',
    choices: [
      { label: 'Inspect the ceiling tape and key', action: () => inspectCeilingKey() },
      { label: 'Question the parents about the key', action: () => questionParentsOnKey() },
      { label: 'Question the servant about the key', action: () => questionServantOnKey() },
      { label: 'Open the autopsy report', action: () => setPhase('autopsy') }
    ]
  },
  autopsy: {
    title: 'Autopsy findings',
    text: 'The postmortem reveals a stab wound and a gunshot to the head. This means the victim was attacked and then executed. The killer wanted the death to look like chaos, not a planned ambush.',
    choices: [
      { label: 'Review all evidence', action: () => reviewEvidence() },
      { label: 'Prepare final accusation', action: () => setPhase('finale') }
    ]
  },
  finale: {
    title: 'Final confrontation',
    text: 'The killer is hiding in plain view, and the family is in panic. You know the servant lied, the key was hidden, and the family’s stories are inconsistent. The final move is the accusation.',
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
  updateSceneText('Knife found: clean handle, but it was hidden on purpose.');
  storyBox.innerHTML = `<h3>Knife inspection</h3><p>The blade is still wet in the center but the handle has cloth fibers. It looks like the killer tried to wipe it clean and hide it under the desk. The knife does not belong to the victim.</p>`;
  renderChoices([
    { label: 'Inspect the thread', action: () => inspectThread() },
    { label: 'Inspect the air bag evidence', action: () => inspectAirBag() },
    { label: 'Return to suspect questioning', action: () => setPhase('suspects') }
  ]);
}

function inspectThread() {
  addEvidence('Thread from the victim’s cuff');
  state.kitty = 'Kitty: The thread was tied around tape. Someone used it like a makeshift knot.';
  renderKitty();
  updateSceneText('Thread clue: tied, not random.');
  storyBox.innerHTML = `<h3>Thread clue</h3><p>The thread is not stray string from the room. It is stitched from the victim’s cuff and knotted tightly around tape. That means the killer used it to secure something to the ceiling or to hide a key. The thread was not accidental. It was deliberate.</p><p><strong>Meaning:</strong> the key was hidden using a makeshift hangar and the killer wanted it to stay out of sight.</p>`;
  renderChoices([
    { label: 'Inspect the ceiling tape', action: () => setPhase('house') },
    { label: 'Question the servant', action: () => questionSuspect('servant') },
    { label: 'Continue scene search', action: () => setPhase('scene') }
  ]);
}

function inspectAirBag() {
  addEvidence('Airbag with fabric fibers');
  state.kitty = 'Kitty: The airbag contains fibers from a servant’s uniform, not from the family.';
  renderKitty();
  updateSceneText('Airbag evidence: servant fibres recovered.');
  storyBox.innerHTML = `<h3>Evidence bag</h3><p>The air bag contains a tiny fiber pattern from a coarse work-cloth. It matches the servant’s uniform more than the family’s clothing. Someone near the victim had a reason to be close enough to tamper with the scene.</p>`;
  renderChoices([
    { label: 'Question the servant', action: () => questionSuspect('servant') },
    { label: 'Question the parents', action: () => questionSuspect('mother') },
    { label: 'Return to scene', action: () => setPhase('scene') }
  ]);
}

function kittySniff() {
  state.kitty = 'Kitty: I smell old smoke, fear, and a hidden metal object near the ceiling. There is a strong thread trace and a small key pattern.';
  renderKitty();
  updateSceneText('Kitty tracks a hidden metal scent.');
  addEvidence('Kitty’s scent note');
  storyBox.innerHTML = `<h3>Kitty’s assessment</h3><p>Kitty scratches at the cracked ceiling tile and points to the upper corner. A hidden object is tucked above the room, and the scent trail leads toward the servant’s side of the house. The dead man was not alone when he was killed.</p>`;
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
    storyBox.innerHTML = `<h3>Mother interview</h3><p>“I do not know anything,” she says. “He had no enemies. We were a normal family.” Her hands tremble when the topic moves to the victim’s room, and her eyes keep returning to the staircase.</p><p>She is withholding something, but not necessarily the murder itself.</p>`;
    addEvidence('Mother’s inconsistent statement');
  }

  if (key === 'father') {
    storyBox.innerHTML = `<h3>Father interview</h3><p>“The boy was troubled, not malicious. I would not hurt my own son.” He says it too quickly, and his fear grows whenever the servant is mentioned. He knows something about the secret room and the key.</p><p>The father is either protecting someone or hiding a family secret.</p>`;
    addEvidence('Father’s defensive answer');
  }

  if (key === 'servant') {
    storyBox.innerHTML = `<h3>Servant interview</h3><p>“He told me to tell his parents he was there,” the servant says, looking down. “But I never did. I was scared.” He keeps glancing toward the ceiling, like he knows exactly what is hidden there.</p><p>The servant is nervous, inconsistent, and too aware of the key.</p>`;
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
  storyBox.innerHTML = `<h3>Town inquiry</h3><p>Neighbors describe the victim as polite, generous, and not a violent man. Yet the family is in constant tension. One witness whispers that the servant was always nervous when the victim received late-night messages.</p><p>The victim was not a target of a random killer; this was personal.</p>`;
  renderChoices([
    { label: 'Return to the house', action: () => setPhase('house') },
    { label: 'Open autopsy report', action: () => setPhase('autopsy') }
  ]);
}

function askAboutVictim() {
  addEvidence('Victim’s behavior report');
  storyBox.innerHTML = `<h3>Victim profile</h3><p>The victim was admired by most people, but he hid deeper tensions. He had a private room, a secret key, and someone in the house who was afraid to be questioned about him. This was not a random murder.</p>`;
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
  storyBox.innerHTML = `<h3>Hidden key</h3><p>Under the cracked ceiling tile is a piece of tape tied with the same thread from the crime scene. Attached to it is a brass key. The key is not random. It belongs to a lockbox or hidden compartment being used to hide something.</p><p>The killer or someone close to the killer hid it here.</p>`;
  renderChoices([
    { label: 'Question the parents about the key', action: () => questionParentsOnKey() },
    { label: 'Question the servant about the key', action: () => questionServantOnKey() },
    { label: 'Open the autopsy report', action: () => setPhase('autopsy') }
  ]);
}

function questionParentsOnKey() {
  storyBox.innerHTML = `<h3>Parents questioned</h3><p>“That key is not ours,” the mother says. The father immediately turns away and looks terrified. They are both hiding something else. The key seems to belong to the servant, or the servant was assigned to keep it safe.</p><p>The key is the missing link. It connects the servant to the victim and the ceiling hiding place.</p>`;
  addEvidence('Parents deny knowledge of the key');
  renderChoices([
    { label: 'Question the servant', action: () => questionServantOnKey() },
    { label: 'Continue to autopsy', action: () => setPhase('autopsy') }
  ]);
}

function questionServantOnKey() {
  storyBox.innerHTML = `<h3>Servant admits the key</h3><p>“It was my key,” the servant says. “The victim gave it to me for safe keeping. He asked me to keep it hidden, because he feared the family would take it from him.” He escapes eye contact, and his face tightens when the detective mentions the thread.</p><p>That is the moment the case becomes clear. The servant was part of the secret, and the hidden key was a cover to keep the truth away from the family.</p>`;
  addEvidence('Servant admits the key belonged to him');
  renderChoices([
    { label: 'Review the full case', action: () => reviewEvidence() },
    { label: 'Move to final accusation', action: () => setPhase('finale') }
  ]);
}

function reviewEvidence() {
  const evidenceSummary = [
    'Knife was wiped and hidden',
    'Thread was from the victim’s cuff and tied around a taped key',
    'Airbag fibers match the servant’s uniform',
    'Key was hidden in the ceiling and belonged to the servant',
    'Parents gave inconsistent stories',
    'Autopsy proves a stab and final gunshot to the head',
    'Town witnesses describe a hidden family tension'
  ];

  storyBox.innerHTML = `<h3>Case review</h3><p>Everything points to one conclusion: the servant had access, the key was hidden, the family was covering for the secret, and the victim was executed to prevent the truth from being exposed.</p><ul>${evidenceSummary.map((item) => '<li>' + item + '</li>').join('')}</ul>`;
  renderChoices([
    { label: 'Prepare final accusation', action: () => setPhase('finale') }
  ]);
}

function accuse(suspectKey) {
  state.accusation = suspectKey;
  if (suspectKey === 'servant') {
    storyBox.innerHTML = `<h3>Case solved</h3><p>You confront the servant. He cracks. He says the victim discovered the family’s secret and demanded money. He stabbed the victim in a panic, then shot him in the head to finish it before the parents could react. He hid the key to keep the evidence from being found.</p><p>The mother and father had no idea the detective had already written a private letter to the police, warning that the servant’s story was false. While the family panics, you step back and call for backup.</p><p><strong>The servant is arrested.</strong> The mystery is solved. Kitty sits on the table, proud and alert.</p>`;
    state.ending = 'win';
    renderChoices([
      { label: 'Restart case', action: () => resetCase() }
    ]);
    updateSceneText('Case solved. The servant is arrested.');
  } else {
    storyBox.innerHTML = `<h3>Wrong accusation</h3><p>It is a mistake. The family was not the true killer. The servant had already hidden the evidence and the lies were set to trap someone else. You force yourself to retreat as the room turns chaotic and the mother swings a baseball bat in a blind panic.</p><p>Your vision flashes. The world dims.</p><p>You collapse, but before the darkness takes you, you remember one thing: you wrote the letter to the police and Kitty was tracking the truth all along.</p>`;
    state.ending = 'loss';
    renderChoices([
      { label: 'Restart case', action: () => resetCase() }
    ]);
    updateSceneText('Wrong accusation. The killer escapes.');
  }
}

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
