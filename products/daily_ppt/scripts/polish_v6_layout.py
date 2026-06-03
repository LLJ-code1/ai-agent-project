from __future__ import annotations

from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile
import xml.etree.ElementTree as ET


ROOT = Path(__file__).resolve().parents[3]
SOURCE_PPTX = Path("/Users/a123/Downloads/宏观传导框架_资产版_V6.pptx")
OUTPUT_PPTX = ROOT / "outputs" / "daily_ppt" / "宏观传导框架_资产版_V6_版式对齐_V1.pptx"

PX_TO_EMU = 9525

NS = {
    "p": "http://schemas.openxmlformats.org/presentationml/2006/main",
    "a": "http://schemas.openxmlformats.org/drawingml/2006/main",
    "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
}

for prefix, uri in NS.items():
    ET.register_namespace(prefix, uri)

SHAPE_TAGS = {
    f"{{{NS['p']}}}sp",
    f"{{{NS['p']}}}pic",
    f"{{{NS['p']}}}cxnSp",
    f"{{{NS['p']}}}graphicFrame",
}


def px(value: float) -> int:
    return int(round(value * PX_TO_EMU))


def shape_id(element: ET.Element) -> str | None:
    node = element.find(".//p:cNvPr", NS)
    return node.get("id") if node is not None else None


def xfrm(element: ET.Element) -> ET.Element | None:
    return element.find(".//a:xfrm", NS)


def frame(element: ET.Element) -> tuple[float, float, float, float] | None:
    node = xfrm(element)
    if node is None:
        return None
    off = node.find("a:off", NS)
    ext = node.find("a:ext", NS)
    if off is None or ext is None:
        return None
    return (
        int(off.get("x")) / PX_TO_EMU,
        int(off.get("y")) / PX_TO_EMU,
        int(ext.get("cx")) / PX_TO_EMU,
        int(ext.get("cy")) / PX_TO_EMU,
    )


def set_frame(element: ET.Element, *, x=None, y=None, w=None, h=None) -> None:
    node = xfrm(element)
    if node is None:
        return
    off = node.find("a:off", NS)
    ext = node.find("a:ext", NS)
    if off is None or ext is None:
        return
    if x is not None:
        off.set("x", str(px(x)))
    if y is not None:
        off.set("y", str(px(y)))
    if w is not None:
        ext.set("cx", str(px(w)))
    if h is not None:
        ext.set("cy", str(px(h)))


def move(element: ET.Element, dx: float = 0, dy: float = 0) -> None:
    current = frame(element)
    if current is None:
        return
    x, y, w, h = current
    set_frame(element, x=x + dx, y=y + dy, w=w, h=h)


def set_text(element: ET.Element, text: str, font_size_pt: float | None = None) -> None:
    tx_body = element.find("p:txBody", NS)
    if tx_body is None:
        return

    for child in list(tx_body):
        if child.tag == f"{{{NS['a']}}}p":
            tx_body.remove(child)

    first = ET.SubElement(tx_body, f"{{{NS['a']}}}p")
    run = ET.SubElement(first, f"{{{NS['a']}}}r")
    r_pr = ET.SubElement(run, f"{{{NS['a']}}}rPr")
    r_pr.set("lang", "zh-CN")
    if font_size_pt is not None:
        r_pr.set("sz", str(int(round(font_size_pt * 100))))
    solid = ET.SubElement(r_pr, f"{{{NS['a']}}}solidFill")
    color = ET.SubElement(solid, f"{{{NS['a']}}}srgbClr")
    color.set("val", "1F2937")
    latin = ET.SubElement(r_pr, f"{{{NS['a']}}}latin")
    latin.set("typeface", "微软雅黑")
    ea = ET.SubElement(r_pr, f"{{{NS['a']}}}ea")
    ea.set("typeface", "微软雅黑")
    t = ET.SubElement(run, f"{{{NS['a']}}}t")
    t.text = text
    end = ET.SubElement(first, f"{{{NS['a']}}}endParaRPr")
    end.set("lang", "zh-CN")
    if font_size_pt is not None:
        end.set("sz", str(int(round(font_size_pt * 100))))

    if font_size_pt is not None:
        for node in element.findall(".//a:rPr", NS):
            node.set("sz", str(int(round(font_size_pt * 100))))
        for node in element.findall(".//a:endParaRPr", NS):
            node.set("sz", str(int(round(font_size_pt * 100))))


def tune_font_sizes(element: ET.Element, replacements: dict[str, str]) -> None:
    for node in element.findall(".//a:rPr", NS):
        size = node.get("sz")
        if size in replacements:
            node.set("sz", replacements[size])
    for node in element.findall(".//a:endParaRPr", NS):
        size = node.get("sz")
        if size in replacements:
            node.set("sz", replacements[size])


def elements_by_id(root: ET.Element) -> dict[str, ET.Element]:
    result = {}
    for element in root.iter():
        if element.tag not in SHAPE_TAGS:
            continue
        sid = shape_id(element)
        if sid:
            result[sid] = element
    return result


def set_if_present(elements: dict[str, ET.Element], sid: str, **kwargs) -> None:
    element = elements.get(sid)
    if element is not None:
        set_frame(element, **kwargs)


def move_if_present(elements: dict[str, ET.Element], sid: str, dx=0, dy=0) -> None:
    element = elements.get(sid)
    if element is not None:
        move(element, dx, dy)


def shift_region(root: ET.Element, *, x_min: float, x_max: float, y_min: float, y_max: float, dx: float, dy: float = 0) -> None:
    for element in root.iter():
        if element.tag not in SHAPE_TAGS:
            continue
        current = frame(element)
        if current is None:
            continue
        x, y, w, h = current
        if x_min <= x < x_max and y_min <= y < y_max:
            move(element, dx, dy)


def bring_to_front(root: ET.Element, sid: str) -> None:
    parents = {child: parent for parent in root.iter() for child in parent}
    for element in root.iter():
        if element.tag not in SHAPE_TAGS:
            continue
        if shape_id(element) != sid:
            continue
        parent = parents.get(element)
        if parent is not None:
            parent.remove(element)
            parent.append(element)
        return


def tune_slide_1(root: ET.Element) -> None:
    elements = elements_by_id(root)

    # Keep the three lower cards on one top baseline.
    for sid in ["292", "540", "541", "478", "479"]:
        set_if_present(elements, sid, y=464.91)

    # The industry card is allowed to be taller than the standard cards so its
    # policy note no longer collides with the fiscal-policy strip.
    set_if_present(elements, "478", y=463.57, h=203.2)
    set_if_present(elements, "494", h=154.7)

    industry_policy = elements.get("355")
    if industry_policy is not None:
        set_frame(industry_policy, x=646.5, y=641.8, w=186.0, h=24.8)
        set_text(
            industry_policy,
            "产业政策：1.纵深推进全国统一大市场建设，深入整治“内卷式”竞争。2.全面实施“人工智能+”行动，发展智能经济新形态，完善人工智能治理。",
            font_size_pt=4.6,
        )
        bring_to_front(root, "355")


def tune_slide_2(root: ET.Element) -> None:
    elements = elements_by_id(root)

    # Match slide 1 top legend and asset/config button vertical rhythm.
    set_if_present(elements, "860", y=3.34)
    for sid in ["861", "862", "863", "864"]:
        set_if_present(elements, sid, y=14.34)

    for sid in ["614", "615", "616", "617", "618"]:
        move_if_present(elements, sid, dy=7.34)

    # Align the top liquidity ribbon to slide 1's left margin.
    for sid in ["872", "874", "875"]:
        move_if_present(elements, sid, dx=11.29)

    economy_summary = elements.get("867")
    if economy_summary is not None:
        set_frame(economy_summary, y=429.6, h=62.5)
        tune_font_sizes(economy_summary, {"1400": "1300", "1200": "1100"})

    # Align the three top liquidity cards to the same column grid as the China page.
    shift_region(root, x_min=0, x_max=280, y_min=155, y_max=355, dx=9.94)
    shift_region(root, x_min=280, x_max=560, y_min=155, y_max=355, dx=12.33)
    shift_region(root, x_min=560, x_max=850, y_min=155, y_max=355, dx=10.21)


def update_pptx() -> Path:
    if not SOURCE_PPTX.exists():
        raise FileNotFoundError(f"source pptx not found: {SOURCE_PPTX}")
    OUTPUT_PPTX.parent.mkdir(parents=True, exist_ok=True)

    slide_updates = {
        "ppt/slides/slide1.xml": tune_slide_1,
        "ppt/slides/slide2.xml": tune_slide_2,
    }

    with ZipFile(SOURCE_PPTX, "r") as src, ZipFile(OUTPUT_PPTX, "w", ZIP_DEFLATED) as out:
        for info in src.infolist():
            data = src.read(info.filename)
            if info.filename in slide_updates:
                root = ET.fromstring(data)
                slide_updates[info.filename](root)
                data = ET.tostring(root, encoding="UTF-8", xml_declaration=True)
            out.writestr(info, data)

    return OUTPUT_PPTX


if __name__ == "__main__":
    print(update_pptx())
