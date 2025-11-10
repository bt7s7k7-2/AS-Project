#import "@preview/rubber-article:0.5.0": *
#import "@preview/datify:1.0.0"

#let title = "Implementácia Entity Component System architektúry"

// Options reference: https://github.com/npikall/rubber-article/blob/main/src/styles.typ
#show: article.with(
  header-display: true,
  header-title: title,
  lang: "sk",
  par-spacing: 1.5em,
  par-first-line-indent: 0em,
)

#maketitle(
  title: title,
  authors: ("Branislav Trstenský", "Tomáš Miština"),
  date: datify.custom-date-format(datetime.today(), lang: "sk", pattern: "long"),
)

#include "doc.typ"

#bibliography("bibliography.bib", full: true, style: "iso-690.csl")
