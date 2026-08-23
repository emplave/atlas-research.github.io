/**
 * What a research group gets from Atlas — THE FIVE VALUE PROPS.
 *
 * One definition, rendered on both the homepage and /research-groups. They were
 * going to be written twice, and two copies of a value proposition drift: the
 * homepage keeps an old claim while the page it links to makes a newer one.
 *
 * ORDER IS DELIBERATE and answers a founder's questions in sequence — the
 * curriculum first because "can I actually do this" is the blocker, publication
 * second because it is the payoff, then the support that makes it survivable.
 * Do not reorder to put the most impressive item first.
 *
 * CLAIMS IN HERE ARE LOAD-BEARING. Named journals are described by what they
 * are, and named universities as places researchers come FROM — never as
 * partners or endorsers of Atlas. Do not add a school, a journal, an index, or a
 * number to this list without it being true and confirmed.
 */
export type ValueProp = {
  title: string;
  body: string;
};

export const VALUE_PROPS: ValueProp[] = [
  {
    title: "A research framework and curriculum.",
    body: "Question formulation, scoping, method selection, analysis, write-up. You are not figuring out how to do research alone.",
  },
  {
    title: "A publication pathway.",
    body: "Groups submit to our partner journals, which are peer-reviewed and indexed in EBSCO and Google Scholar, and to the Atlas journal.",
  },
  {
    title: "Sessions with researchers.",
    body: "Groups hear from researchers at Stanford, UC Berkeley, and USC on research methods, with live Q&A.",
  },
  {
    title: "Mentor and TA support.",
    body: "Direct access to mentors and TAs in chat while the work is in progress.",
  },
  {
    title: "Work with peers.",
    body: "Research groups are teams. You work alongside other students on the same question, not alone on a project no one else sees.",
  },
];

/**
 * What running a group actually involves — the commitment, stated plainly.
 *
 * This exists because the honest version of the ask is more persuasive than a
 * vague one. A founder deciding whether to commit needs the floor ("three"),
 * the weekly cost ("two to four hours"), and the absence of gatekeeping ("no
 * faculty advisor required") before a CTA means anything.
 *
 * THREE IS A MINIMUM WITH NO MAXIMUM. Never reintroduce an upper bound here or
 * anywhere else — the site said "three to ten" for months, which turned a floor
 * into a cap and told a founder with twelve interested classmates to turn two
 * away.
 */
export const REQUIREMENTS: string[] = [
  "Three or more members. That is the minimum. There is no maximum.",
  "Two to four hours a week, depending on how fast you want to move.",
  "One semester to finish a paper. Groups that want to keep going, keep going.",
  "No faculty advisor required. No school approval required. No dues.",
  "You pick the question. Any field.",
];
