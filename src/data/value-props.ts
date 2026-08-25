/**
 * What a research group gets from Atlas — THE FIVE VALUE PROPS.
 *
 * One definition, rendered on both the homepage and /research-groups. They were
 * going to be written twice, and two copies of a value proposition drift: the
 * homepage keeps an old claim while the page it links to makes a newer one.
 *
 * ORDER IS DELIBERATE. "You lead it" is first because STATUS COMES BEFORE
 * FEATURES: the reader is deciding whether they get to be someone, not which
 * services they receive. Then the curriculum, because "can I actually do this"
 * is the next blocker. Then the teaching and the feedback that make it
 * survivable, and publication last as the payoff. Do not reorder to put the most
 * impressive item first.
 *
 * FIVE, NOT SIX. "Work with peers" was removed: it repeated "recruit three or
 * more people" from the subhead, and six props is more than a reader finishes.
 *
 * TITLES LEAD WITH WHAT THE READER DOES, not what Atlas owns. "A research
 * framework and curriculum" became "We walk you through it"; "Mentor and TA
 * support" became "Feedback while you work". Do not revert them to noun phrases
 * naming an Atlas asset.
 *
 * "LESSONS FROM RESEARCHERS", never "sessions with researchers".
 *
 * TWO WORDS FOR ONE ACTIVITY, AND THAT IS DELIBERATE. Do not harmonise them:
 *
 *   "lessons"       — the STUDENT-FACING word. What a group receives. Used here,
 *                     on the homepage, and in llms.txt.
 *   "guest session" — the RESEARCHER- AND PARTNER-FACING register. Used when
 *                     inviting a researcher to teach or describing that
 *                     contribution to an institution: /get-involved's "Run a
 *                     guest session", /partners, and the matching seo.ts
 *                     descriptions. "Run a lesson" is the wrong register to put
 *                     in front of university faculty.
 *
 * A sweep that renames one to the other in both directions will read as a
 * correction and is not. The Fellowship's "guest sessions" is a third case:
 * separate, approved phrasing on its own page, also not covered by this.
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

/**
 * The heading and subhead that sit above the props.
 *
 * SHARED, like the props themselves. They used to live in each parent — the
 * homepage section had its own title and intro, /research-groups had "What you
 * get." — which meant three strings describing one thing in two files.
 */
export const VALUE_PROPS_HEADING = "Lead a research group.";

export const VALUE_PROPS_SUBHEAD =
  "We walk you from question to publication. You pick a question you care about, recruit three or more people, and run the group. At a school, in a community, or entirely online.";

export const VALUE_PROPS: ValueProp[] = [
  {
    title: "You lead it.",
    body: "You are the Principal Researcher. You choose the question, pick your members, and run the meetings. It is your group, not a class you sit in.",
  },
  {
    title: "We walk you through it.",
    body: "Question formulation, scoping, method selection, analysis, write-up. Five stages, with the curriculum and a mentor for each one. Nobody expects you to already know how to do this.",
  },
  {
    title: "Lessons from researchers.",
    body: "Groups learn from researchers at Stanford, UC Berkeley, and USC on research methods, with live Q&A.",
  },
  {
    title: "Feedback while you work.",
    body: "Mentors and TAs read your drafts and answer questions in chat while the work is in progress, not just at checkpoints.",
  },
  {
    title: "A publication pathway.",
    body: "Groups submit to our partner journals, which are peer-reviewed and indexed in EBSCO and Google Scholar, and to the Atlas journal.",
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
 *
 * "ABOUT A SEMESTER", NOT "ONE SEMESTER". No Atlas group has finished a paper
 * yet, so a hard number is a promise nobody can check. Do not tighten this back
 * to a specific figure until there are completed groups to measure.
 *
 * THREE LINES, DOWN FROM FIVE. The five were one fact each, which read as sparse
 * at desktop width — a column of short statements with more rule than text. The
 * merged pairs belong together anyway: the time commitment and the timeline are
 * one question, and "no gatekeeping" and "any question" are both answers to
 * "what will you not make me do".
 */
export const REQUIREMENTS: string[] = [
  "Three or more members. There is no maximum.",
  "Two to four hours a week. About a semester to finish a paper.",
  "No faculty advisor, no school approval, no dues. You pick the question, in any field.",
];
