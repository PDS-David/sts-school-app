#!/usr/bin/env python3
"""Generate the V1 Business Studies accounting figures (PNG + editable SVG).

Every debit/credit side, heading, date and amount is copied from the original
JSS3 Business Studies notes (see VISUAL_REGISTER.csv for locators). Where the
original contains an error the figure shows the source value plus a visible
flag, or (trial balance, second method) the corrected value plus a visible
"corrected" flag. Worked answers are labelled newly prepared teaching.
Usage: python3 generate_v1_figures.py <output_dir>   (needs cairosvg)
"""
import sys
import textwrap
from pathlib import Path
from xml.sax.saxutils import escape
import cairosvg

W = 720
TOO_WIDE = []
INK, GREY, RED, BLUE, GREEN = '#1b2a33', '#6b7780', '#a4260f', '#14527a', '#1f6b3a'
FONT = "DejaVu Sans, Arial, sans-serif"


def wrap(s, size, width=None, bold=False):
    width = width or (W - 48)
    return textwrap.wrap(s, max(10, int(width / (size * (0.63 if bold else 0.60)))))


class Fig:
    def __init__(self, title, subtitle=None):
        self.p = []
        self.y = 20
        tsize = min(25, int((W - 48) / (len(title) * 0.63)))
        self.text(24, self.y + 22, title, tsize, bold=True)
        self.y += 36
        if subtitle:
            for line in wrap(' '.join(subtitle), 17):
                self.y += 23
                self.text(24, self.y, line, 17, fill=GREY)
        self.y += 18

    def text(self, x, y, s, size=20, anchor='start', fill=INK, bold=False, italic=False):
        est = len(s) * size * (0.63 if bold else 0.60)
        if anchor == 'start' and x + est > W - 8:
            TOO_WIDE.append(f'{x + est:.0f}px: {s!r}')
        self.p.append(f'<text x="{x}" y="{y}" font-family="{FONT}" font-size="{size}" text-anchor="{anchor}" fill="{fill}"'
                      f'{" font-weight=\"bold\"" if bold else ""}{" font-style=\"italic\"" if italic else ""}>{escape(s)}</text>')

    def line(self, x1, y1, x2, y2, w=2, fill=INK):
        self.p.append(f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{fill}" stroke-width="{w}"/>')

    def rect(self, x, y, w, h, fill='none', stroke=INK, sw=2):
        self.p.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"/>')

    def notes(self, lines, fill=INK, size=18, gap=8):
        for ln in lines:
            for part in wrap(ln, size):
                self.y += size + 8
                self.text(24, self.y, part, size, fill=fill)
        self.y += gap

    def svg(self):
        h = self.y + 16
        return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{h}" viewBox="0 0 {W} {h}">'
                f'<rect width="{W}" height="{h}" fill="#ffffff"/>' + ''.join(self.p) + '</svg>')

    # ---- T-account -------------------------------------------------------
    def taccount(self, title, rows, x=24, w=672, rowh=34, head='Account'):
        """rows: list of (left, right, kind). left/right = (date, particulars, amount) or None.
        kind: 'row' | 'total' (rules above/below amount) | 'bal' (plain, after the totals)."""
        mid = x + w // 2
        y0 = self.y + 8
        self.text(mid, y0 + 22, title, 22, anchor='middle', bold=True)
        top = y0 + 32
        self.text(x + 4, top - 4, 'Dr', 16, fill=GREY)
        self.text(x + w - 4, top - 4, 'Cr', 16, fill=GREY, anchor='end')
        self.line(x, top, x + w, top, 3)
        height = rowh * len(rows) + 10
        self.line(mid, top, mid, top + height, 3)
        has_date = [any(r[side] and r[side][0] for r in rows) for side in (0, 1)]
        for i, (L, R, kind) in enumerate(rows):
            base = top + rowh * (i + 1) - 8
            for side, cell in ((0, L), (1, R)):
                if not cell:
                    continue
                d, p, a = cell
                sx = x + side * (w // 2)
                half = w // 2
                if d:
                    self.text(sx + 10, base, d, 19)
                if p:
                    self.text(sx + (100 if has_date[side] else 10), base, p, 19)
                if a:
                    self.text(sx + half - 12, base, a, 19, anchor='end', bold=(kind == 'total'))
                if kind == 'total' and a:
                    self.line(sx + half - 100, base - 22, sx + half - 8, base - 22, 2)
                    self.line(sx + half - 100, base + 5, sx + half - 8, base + 5, 2)
                    self.line(sx + half - 100, base + 9, sx + half - 8, base + 9, 2)
        self.y = top + height + 6

    def flagged(self, lines, colour=RED, label=None):
        lines = wrap(' '.join(lines), 17, width=W - 48 - 28)
        self.y += 10
        h = 12 + 26 * len(lines)
        self.rect(24, self.y, 672, h, fill='#fff6f3' if colour == RED else '#f2f8fc', stroke=colour, sw=2)
        for i, ln in enumerate(lines):
            self.text(38, self.y + 28 + 26 * i, ln, 17, fill=colour, bold=(i == 0 and label is not None))
        self.y += h + 6

    def table(self, header, rows, widths, x=24, rowh=36, bold_rows=(), align=None, double_rows=()):
        y = self.y + 8
        total_w = sum(widths)
        align = align or ['start'] * len(widths)
        self.rect(x, y, total_w, rowh, fill='#e9eff3')
        cx = x
        for i, (h, w) in enumerate(zip(header, widths)):
            self.text(cx + (8 if align[i] == 'start' else w - 10), y + 25, h, 19, bold=True, anchor=align[i])
            cx += w
        for r, row in enumerate(rows):
            ry = y + rowh * (r + 1)
            self.rect(x, ry, total_w, rowh)
            cx = x
            for i, (cell, w) in enumerate(zip(row, widths)):
                self.text(cx + (8 if align[i] == 'start' else w - 10), ry + 25, cell, 19, anchor=align[i], bold=(r in bold_rows))
                cx += w
        cx = x
        for w in widths[:-1]:
            cx += w
            self.line(cx, y, cx, y + rowh * (len(rows) + 1), 2)
        for r in double_rows:
            ry = y + rowh * (r + 1) + rowh
            self.line(x, ry + 4, x + total_w, ry + 4, 2)
        self.y = y + rowh * (len(rows) + 1) + 8


FOOT_REDRAWN = 'Redrawn for the app from the original note; sides, headings and amounts copied from it.'
FOOT_NEW = 'Newly prepared teaching worked answer. Not part of the original school document.'
figs = {}

# ---------------------------------------------------------------- First Term, Week 5 --------------
f = Fig('Double entry: the Dr / Cr layout', ['Original Week 5 layout: Dr on the left, Cr on the right, N = naira amounts.'])
y0 = f.y + 10
f.text(24 + 4, y0 + 20, 'Dr', 22, bold=True)
f.text(696 - 4, y0 + 20, 'Cr', 22, anchor='end', bold=True)
f.line(24, y0 + 32, 696, y0 + 32, 3)
f.line(360, y0 + 32, 360, y0 + 112, 3)
f.text(340, y0 + 66, 'N', 20, anchor='end')
f.text(676, y0 + 66, 'N', 20, anchor='end')
f.y = y0 + 124
f.notes(['Rule from the note: credit the giver (Cr) and debit the receiver (Dr).',
         'Every debit entry has a matching credit entry in another account.'])
f.notes([FOOT_REDRAWN], fill=GREY, size=15)
figs['V1-DE-01-dr-cr-layout'] = f

f = Fig('Worked example 1: Ade starts a business', ['Original: "On January 5, 2010, Ade started a business with N5000 cash".'])
f.taccount('Capital Account', [(None, ('Jan. 5', 'Cash', '5000'), 'row'), (None, None, 'row')])
f.taccount('Cash Account', [(('Jan. 2', 'Capital', '5000'), None, 'row'), (None, None, 'row')])
f.flagged(['Source date mismatch (kept as printed):',
           'the Capital Account says Jan. 5, the Cash Account says Jan. 2.',
           'The sides and the amount are right. Capital is credited (the giver);',
           'Cash is debited (the receiver). The intended date is not recoverable.'])
f.notes([FOOT_REDRAWN], fill=GREY, size=15)
figs['V1-DE-02-example1-capital-cash'] = f

f = Fig('Worked example 2: machine bought for cash', ['Original: "On Jan. 3rd, bought machine N2000 cash".'])
f.taccount('Machine Account', [(('Jan. 3', 'Cash', '2000'), None, 'row'), (None, None, 'row')])
f.taccount('Cash Account', [(None, ('Jan. 3', 'Machine', '2000'), 'row'), (None, None, 'row')])
f.flagged(['Machine (asset) receives value: debit. Cash gives value: credit.'], colour=BLUE)
f.notes([FOOT_REDRAWN], fill=GREY, size=15)
figs['V1-DE-03-example2-machine-cash'] = f

f = Fig('Worked example 3: paying a creditor', ['Original: "Jan 4th paid A. Ngozi N500 by cash".'])
f.taccount('A. Ngozi Account', [(('Jan 4', 'Cash', '500'), None, 'row'), (None, None, 'row')])
f.taccount('Cash Account', [(None, ('Jan 4', 'A. Ngozi', '500'), 'row'), (None, None, 'row')])
f.flagged(['Ngozi receives the payment: debit. Cash gives it: credit.'], colour=BLUE)
f.notes([FOOT_REDRAWN], fill=GREY, size=15)
figs['V1-DE-04-example3-ngozi-cash'] = f

f = Fig('Worked example 4: books sold for cash', ['Original: "sold books for cash N10,000" (the date is printed Jan 10 in both accounts).'])
f.taccount('Cash Account', [(('Jan 10', 'Sales', '10,000'), None, 'row'), (None, None, 'row')])
f.taccount('Sales Account', [(None, ('Jan 10', 'Cash', '10,000'), 'row'), (None, None, 'row')])
f.flagged(['Cash receives money: debit. Sales gives the goods: credit.',
           'The note types "Janlo" in the sentence; both accounts show Jan 10.'], colour=BLUE)
f.notes([FOOT_REDRAWN], fill=GREY, size=15)
figs['V1-DE-05-example4-cash-sales'] = f

f = Fig('Exercise answer: Papaluwe Transport Company', ['Opening cash N15,000 in Feb. 2009. Four transactions from the original exercise.'])
f.taccount('Cash Account', [
    (('', 'Balance b/d', '15,000'), ('Feb. 1', 'Wages', '3,000'), 'row'),
    (('Feb. 5', 'Felele', '5,000'), ('Feb. 4', 'Electricity', '1,000'), 'row'),
    (None, ('Feb. 10', 'Rent', '500'), 'row'),
    (None, ('', 'Balance c/d', '15,500'), 'row'),
    (('', '', '20,000'), ('', '', '20,000'), 'total')], rowh=34)
f.taccount('Wages Account', [(('Feb. 1', 'Cash', '3,000'), None, 'row')])
f.taccount('Electricity Account', [(('Feb. 4', 'Cash', '1,000'), None, 'row')])
f.taccount('Felele Account', [(None, ('Feb. 5', 'Cash', '5,000'), 'row')])
f.taccount('Rent Account', [(('Feb. 10', 'Cash', '500'), None, 'row')])
f.notes(['Check: 15,000 + 5,000 - 3,000 - 1,000 - 500 = 15,500 (a debit balance, brought down).', FOOT_NEW], fill=GREY, size=15)
figs['V1-DE-06-exercise-answer-papaluwe'] = f

# ---------------------------------------------------------------- First Term, Week 6 --------------
f = Fig('Trial balance: the ruled layout', ['Original Week 6 layout: Particulars, Dr and Cr columns.'])
f.table(['Particulars', 'Dr', 'Cr'], [['', '', ''], ['', '', ''], ['', '', '']], [320, 176, 176], align=['start', 'end', 'end'])
f.notes(['Rule your trial balance, then total the Dr and Cr columns.', FOOT_REDRAWN], fill=GREY, size=16)
figs['V1-TB-01-trial-balance-layout'] = f

f = Fig('Cash book: Madam Cash Nig. Ltd', ['Original two-sided cash book. Dr side left, Cr side right. F = folio (empty in the original).'])
f.table(['Date', 'Particulars', 'F', 'Cash', 'Date', 'Particulars', 'F', 'Cash'],
        [['July 1', 'Capital', '', '950', 'July 7', 'Motor van', '', '3,200'],
         ['July 5', 'Sales', '', '7,000', 'July 10', 'Salary', '', '400'],
         ['July 14', 'Sales', '', '2,000', 'July 12', 'Wages', '', '200'],
         ['', '', '', '', '', 'Bal. c/d', '', '6,150'],
         ['', '', '', '9,950', '', '', '', '9,950'],
         ['Aug. 1', 'Bal. b/d', '', '6,150', '', '', '', '']],
        [78, 142, 30, 80, 78, 142, 30, 92], rowh=36, align=['start', 'start', 'start', 'end', 'start', 'start', 'start', 'end'],
        bold_rows=(4,))
f.notes(['Check: 950 + 7,000 + 2,000 = 9,950. Payments 3,200 + 400 + 200 = 3,800.', '9,950 - 3,800 = 6,150 (the cash balance carried down).', FOOT_REDRAWN], fill=GREY, size=16)
figs['V1-TB-02-cash-book'] = f

f = Fig('Ledger accounts (1): Capital and Sales', ['Madam Cash Nig. Ltd. Items are posted, balanced, then carried down (c/d) and brought down (b/d).'])
f.taccount('Capital Account', [
    (('', 'Bal. c/d', '950'), ('July 1', 'Cash', '950'), 'row'),
    (('', '', '950'), ('', '', '950'), 'total'),
    (None, ('', 'Bal. b/d', '950'), 'bal')])
f.taccount('Sales Account', [
    (('', 'Bal. c/d', '9,000'), ('July 5', 'Cash', '7,000'), 'row'),
    (None, ('July 14', 'Cash', '2,000'), 'row'),
    (('', '', '9,000'), ('', '', '9,000'), 'total'),
    (None, ('', 'Bal. b/d', '9,000'), 'bal')])
f.flagged(['Both accounts have credit balances: capital is owed to the owner; sales are income.'], colour=BLUE)
f.notes([FOOT_REDRAWN], fill=GREY, size=15)
figs['V1-TB-03-ledgers-capital-sales'] = f

f = Fig('Ledger accounts (2): Motor Van, Salary, Wages', ['Madam Cash Nig. Ltd. Each is debited from Cash, then balanced.'])
f.taccount('Motor Van Account', [
    (('July 7', 'Cash', '3,200'), ('', 'Bal. c/d', '3,200'), 'row'),
    (('', '', '3,200'), ('', '', '3,200'), 'total'),
    (('', 'Bal. b/d', '3,200'), None, 'bal')])
f.taccount('Salary Account', [
    (('July 10', 'Cash', '400'), ('', 'Bal. c/d', '400'), 'row'),
    (('', '', '400'), ('', '', '400'), 'total'),
    (('', 'Bal. b/d', '400'), None, 'bal')])
f.taccount('Wages Account', [
    (('July 12', 'Cash', '200'), ('', 'Bal. c/d', '200'), 'row'),
    (('', '', '200'), ('', '', '200'), 'total'),
    (('', 'Bal. b/d', '200'), None, 'bal')])
f.flagged(['All three have debit balances: an asset (van) and two expenses.'], colour=BLUE)
f.notes([FOOT_REDRAWN], fill=GREY, size=15)
figs['V1-TB-04-ledgers-van-salary-wages'] = f

f = Fig('Trial balance: Madam Cash (first method)', ['Balances taken from the ledgers and the cash book.'])
f.table(['Particulars', 'Dr  N', 'Cr  N'],
        [['Capital', '', '950'], ['Sales', '', '9,000'], ['Motor van', '3,200', ''], ['Salary', '400', ''], ['Wages', '200', ''], ['Cash', '6,150', ''], ['Total', '9,950', '9,950']],
        [320, 176, 176], align=['start', 'end', 'end'], bold_rows=(6,))
f.notes(['Dr: 3,200 + 400 + 200 + 6,150 = 9,950.   Cr: 950 + 9,000 = 9,950.   Balanced.'])
f.flagged(['Source date conflict (kept as printed): the question says "as at July, 2005";',
           'the title says "as at 30 July, 2008". The year is not recoverable; the figures are unaffected.'])
f.notes([FOOT_REDRAWN], fill=GREY, size=15)
figs['V1-TB-05-trial-balance-madam-cash'] = f

f = Fig('Trial balance: second method (corrected)', ['Given balances: Building 2000, Capital 2000, Equipment 5000, Stock of finished goods 1000,', 'Motor van 3000, Creditor 7000, Accrued 2000.'])
f.table(['Particulars', 'Dr  N', 'Cr  N'],
        [['Building', '2,000', ''], ['Capital', '', '2,000'], ['Equipment', '5,000', ''], ['Stock', '1,000', ''], ['Motor van', '3,000', ''], ['Creditor', '', '7,000'], ['Accrued', '', '2,000'], ['Total', '11,000', '11,000']],
        [320, 176, 176], align=['start', 'end', 'end'], bold_rows=(7,))
f.flagged(['CORRECTED: the original table lost the label "Building". Its 2000 sits',
           'in the heading row (under "Particular"), so the Dr column adds to only 9,000',
           'but is printed as 11,000. With Building restored: Dr 2,000 + 5,000 + 1,000',
           '+ 3,000 = 11,000 and Cr 2,000 + 7,000 + 2,000 = 11,000.'], label='c')
f.notes(['Assets and expenses are debits. Liabilities and capital are credits.', 'Correction prepared for teaching; the original note is kept unchanged.'], fill=GREY, size=15)
figs['V1-TB-06-trial-balance-second-method-corrected'] = f

# ---------------------------------------------------------------- Second Term, Week 5 --------------
f = Fig('Simple layout of a Trading Account', ['*** = an amount to be filled in (as in the original). Debit side left, credit side right.'])
f.taccount('Trading Account', [
    (('', 'Opening stock', '***'), ('', 'Sales', '***'), 'row'),
    (('', 'Add: purchases', '***'), ('', 'Less: sales return', '**'), 'row'),
    (('', '', '***'), ('', 'Net sales', '***'), 'row'),
    (('', 'Less: return outward', '**'), None, 'row'),
    (('', 'Cost of goods available', '***'), None, 'row'),
    (('', 'Less: closing stock', '***'), None, 'row'),
    (('', 'Cost of goods sold', '***'), None, 'row'),
    (('', 'Gross profit c/d', '***'), None, 'row'),
    (('', '', '***'), ('', '', '***'), 'total')], rowh=36)
f.notes(['Gross profit = net sales - cost of goods sold. It is carried down (c/d).'])
f.flagged(['Wording in the original: this layout says "sales return"; the notes above it',
           'define the same item as "Return inward". Carriage inward is defined in the',
           'notes but has no line in this simple layout. Both are left as printed.'], colour=BLUE)
f.notes([FOOT_REDRAWN], fill=GREY, size=15)
figs['V1-TP-01-trading-account-layout'] = f

f = Fig('Simple layout of a Profit and Loss Account', ['*** = an amount to be filled in (as in the original).'])
f.taccount('Profit and Loss Account', [
    (('', 'Wages and expenses', '***'), ('', 'Gross profit b/d', '***'), 'row'),
    (('', 'General expenses', '***'), ('', 'Add: discount received', '***'), 'row'),
    (('', 'Advertising', '***'), ('', '', '***'), 'row'),
    (('', 'Electricity', '***'), None, 'row'),
    (('', 'Office expenses', '***'), None, 'row'),
    (('', 'Discount allowed', '***'), None, 'row'),
    (('', '', '***'), None, 'row'),
    (('', 'Net profit', '***'), None, 'row'),
    (('', '', '***'), ('', '', '***'), 'total')], rowh=36)
f.notes(['Net profit = gross profit + other income (discount received) - expenses.'])
f.notes([FOOT_REDRAWN], fill=GREY, size=15)
figs['V1-TP-02-profit-loss-layout'] = f

f = Fig('Worked answer: babasuwe Nig. Ltd, 31 Dec. 2008', ['Figures from the original assignment. Return inward 150, return outward 100.'])
f.taccount('Trading Account (year ended 31 Dec. 2008)', [
    (('', 'Opening stock', '2,000'), ('', 'Sales', '10,000'), 'row'),
    (('', 'Add: purchases', '2,000'), ('', 'Less: return inward', '150'), 'row'),
    (('', '', '4,000'), ('', 'Net sales', '9,850'), 'row'),
    (('', 'Less: return outward', '100'), None, 'row'),
    (('', 'Cost of goods available', '3,900'), None, 'row'),
    (('', 'Less: closing stock', '1,000'), None, 'row'),
    (('', 'Cost of goods sold', '2,900'), None, 'row'),
    (('', 'Gross profit c/d', '6,950'), None, 'row'),
    (('', '', '9,850'), ('', '', '9,850'), 'total')], rowh=36)
f.taccount('Profit and Loss Account', [
    (('', 'Rent expenses', '500'), ('', 'Gross profit b/d', '6,950'), 'row'),
    (('', 'Insurance', '600'), ('', 'Add: discount received', '400'), 'row'),
    (('', 'Electricity', '300'), None, 'row'),
    (('', 'Discount allowed', '200'), None, 'row'),
    (('', 'Net profit', '5,750'), None, 'row'),
    (('', '', '7,350'), ('', '', '7,350'), 'total')], rowh=36)
f.notes(['Expenses 500 + 600 + 300 + 200 = 1,600.  Income 6,950 + 400 = 7,350.  7,350 - 1,600 = 5,750.', FOOT_NEW], fill=GREY, size=15)
figs['V1-TP-03-worked-answer-babasuwe'] = f

# ---------------------------------------------------------------- Second Term (ex-Third-Term file) ---
f = Fig('Simple tabulation: a table of 5 columns and 3 rows', ['The original lesson says "The table above has 5 columns and 3 rows".'])
y0 = f.y + 10
cw, rh = 120, 54
for r in range(4):
    f.line(24, y0 + r * rh, 24 + 5 * cw, y0 + r * rh, 2)
for c in range(6):
    f.line(24 + c * cw, y0, 24 + c * cw, y0 + 3 * rh, 2)
for c in range(5):
    f.text(24 + c * cw + cw / 2, y0 - 6 + 0, f'Column {c + 1}', 15, anchor='middle', fill=GREY)
for r in range(3):
    f.text(8, y0 + r * rh + 33, str(r + 1), 15, fill=GREY)
f.y = y0 + 3 * rh + 14
f.notes(['Count columns across (5) and rows down (3). The cells are empty in the original.', 'Redrawn from the empty table in the original document (5 x 3).'], fill=GREY, size=16)
figs['V1-TAB-01-blank-table-5x3'] = f


def main(out):
    out = Path(out)
    out.mkdir(parents=True, exist_ok=True)
    for name, fig in figs.items():
        svg = fig.svg()
        (out / f'{name}.svg').write_text(svg, encoding='utf-8')
        cairosvg.svg2png(bytestring=svg.encode('utf-8'), write_to=str(out / f'{name}.png'), scale=1.5)
    if TOO_WIDE:
        raise SystemExit('text too wide:\n' + '\n'.join(TOO_WIDE))
    print(len(figs), 'figures written to', out)


if __name__ == '__main__':
    main(sys.argv[1] if len(sys.argv) > 1 else '.')
