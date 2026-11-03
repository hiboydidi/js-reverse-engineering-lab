function createCounter(start = 0) {
  let count = start;
  return function increment() {
    count += 1;
    return count;
  };
}

const nextCount = createCounter(0);
document.querySelector('#counter').addEventListener('click', () => {
  document.querySelector('#counter-output').textContent = 'count = ' + nextCount();
});

const parent = { role: 'teacher' };
const learner = Object.create(parent);
learner.name = 'student';

document.querySelector('#prototype').addEventListener('click', () => {
  document.querySelector('#prototype-output').textContent = JSON.stringify(
    {
      ownKeys: Object.keys(learner),
      name: learner.name,
      inheritedRole: learner.role,
      hasOwnRole: Object.hasOwn(learner, 'role'),
      prototypeIsParent: Object.getPrototypeOf(learner) === parent,
    },
    null,
    2,
  );
});

document.querySelector('#event-loop').addEventListener('click', async () => {
  const output = [];
  output.push('1. 同步任务');
  Promise.resolve().then(() => output.push('2. Promise 微任务'));
  setTimeout(() => {
    output.push('4. setTimeout 宏任务');
    document.querySelector('#event-output').textContent = output.join('\n');
  }, 0);
  output.push('3. 同步任务结束');
  await Promise.resolve();
  document.querySelector('#event-output').textContent = output.join('\n');
});
