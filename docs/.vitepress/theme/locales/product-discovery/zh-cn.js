export default {
  common: { exercise: '对照练习' },
  doubleDiamond: {
    ariaLabel: '双钻模型四阶段对照', eyebrow: '四阶段对照', title: '比较各阶段的工作和产出', description: '选择一个阶段，查看该阶段应完成的工作。', problemSpace: '问题空间', solutionSpace: '方案空间', doNow: '现在做', output: '阶段产出', avoid: '暂时别做',
    stages: [
      { number: '01', key: 'Discover', cn: '发现', mode: '问题发散', question: '我们还没看见什么？', action: '观察现场、访谈用户、收集替代方案和异常时刻。', output: '场景笔记 · 问题清单 · 行为证据', avoid: '别过早解释原因，也别开始画原型。' },
      { number: '02', key: 'Define', cn: '定义', mode: '问题收敛', question: '本轮应优先解决哪个问题？', action: '聚类证据，比较频率、痛感和价值，重写一句问题定义。', output: '核心问题 · 目标用户 · 成功标准', avoid: '别试图同时解决所有问题。' },
      { number: '03', key: 'Develop', cn: '发展', mode: '方案发散', question: '同一个问题还能怎么解？', action: '强制想出多种方案，包括不用 AI、低成本和可快速验证的做法。', output: '方案组合 · 流程草图 · 风险假设', avoid: '别被第一个想到的功能绑住。' },
      { number: '04', key: 'Deliver', cn: '交付', mode: '方案收敛', question: '最小的真实验证是什么？', action: '选一个切口做可测原型，放到用户面前，根据行为继续迭代。', output: '最小原型 · 测试任务 · 学习结论', avoid: '别把“可测”做成“大而全上线”。' }
    ]
  },
  jtbd: {
    ariaLabel: 'JTBD 对照练习', title: '区分产品功能与用户任务', hint: '点击切换场景', selectScenario: '选择产品场景', productFeature: '产品功能', solutionDescription: '对方案的描述', turnToJob: '转向用户任务', userJob: '用户任务', situation: '场景', iWant: '我想', soThat: '以便', workaround: '现有做法',
    cases: [
      { number: '01', name: '投简历', feature: 'AI 简历优化器', situation: '当我准备投递一个心仪岗位时，', progress: '快速把现有经历改成更贴合岗位的版本，', outcome: '更有把握地完成投递，不再边改边怀疑自己。', workaround: '复制旧简历、反复手改，再请朋友帮看' },
      { number: '02', name: '会议纪要', feature: '语音转写 + 摘要', situation: '当一场信息量很大的项目会刚结束时，', progress: '在 10 分钟内理清决定、待办、责任人和时间，', outcome: '马上同步团队并推进执行，不让信息留在记忆里。', workaround: '翻录音、聊天记录和自己的零散笔记' },
      { number: '03', name: '月底理账', feature: '自动分类记账', situation: '当我发现账户余额比预期少很多时，', progress: '看懂钱花在了哪些类别和异常项上，', outcome: '重新获得掌控感，并知道下个月该调整什么。', workaround: '打开几个支付 App，靠回忆对照每笔消费' }
    ]
  },
  interview: {
    ariaLabel: '访谈证据分拣练习', title: '区分行为证据与主观意见', description: '对每句访谈原话做出判断，然后查看解释。', correctCount: '判断正确', judgeStatement: '判断第 {number} 句', evidence: '证据', opinion: '意见', correct: '判断正确', incorrect: '判断有误', criterionLabel: '判断依据：', criterion: '事情是否已经发生？用户是否付出了时间、金钱或行动成本？',
    statements: [
      { text: '“如果有这个工具，我应该会试试。”', evidence: false, note: '这是对未来的猜测，没有行为成本。' }, { text: '“我上周为了改简历花了一整个晚上。”', evidence: true, note: '有具体时间和已发生的成本。' }, { text: '“听起来很有用，你可以做做看。”', evidence: false, note: '这是礼貌性鼓励，不能证明需求。' }, { text: '“我现在会把简历发给学长，但不好意思总麻烦他。”', evidence: true, note: '展示了现有替代方案及它的摩擦。' }, { text: '“我觉得 AI 肯定能解决这个问题。”', evidence: false, note: '这是对方案的意见，不是问题存在的证据。' }, { text: '“我已经买过两次付费改简历服务。”', evidence: true, note: '真实付费行为是很强的信号。' }
    ]
  }
}
