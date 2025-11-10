#!/bin/env bash

wget -O doc.html https://docs.google.com/document/d/1m3WaH1fj0WtkPz_jvbemS4ybU-tLCPmySUXcQHbWcCM/mobilebasic?tab=t.hbg6bm6m3kav
ucpem run @bt7s7k7/MiniML+cli build doc.html doc.typ --htmlSelector=.doc-content --htmlCite --htmlNormalizeLists --htmlMath
