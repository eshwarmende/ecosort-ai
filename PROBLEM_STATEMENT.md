# Submission Document: EcoSort AI — Smart Waste Segregation

## 1. Executive Summary
EcoSort AI is an intelligent, accessible, and source-level waste segregation assistant. By leveraging real-time computer vision and multimodal large language models, the application enables everyday consumers to instantly identify waste materials, classify them, locate the appropriate physical disposal bins, and learn clean disposal habits. This document details the underlying environmental problems of waste sorting, who is impacted, the limitations of current sorting approaches, and how our AI-driven solution resolves these inefficiencies.

---

## 2. The Problem: The Source-Level Segregation Crisis
Global waste generation is projected to reach **3.40 billion tonnes annually by 2050**. While recycling systems are mature in many parts of the world, their effectiveness is bottlenecked by a single critical factor: **poor segregation at the source**.

When consumers dispose of waste, they frequently place items in the wrong bins. This leads to two major issues:
*   **Recycling Contamination**: A single unwashed plastic container or greasy pizza box can contaminate an entire recycling stream. Once contaminated, recycling facilities are forced to redirect entire batches of recyclable materials to landfills.
*   **Resource Depletion**: Materials that could have been re-entered into the circular economy (such as PET plastics, aluminium, and clean paper) are lost forever in landfills, increasing the demand for raw material extraction.

Furthermore, waste management rules are not uniform. They vary significantly by city, municipality, and country, leaving consumers confused about how to handle complex materials like e-waste, multi-layered packaging, and compostable plastics.

---

## 3. Target Audience & Stakeholders Affected
The failure of source-level waste segregation creates a cascading negative impact across multiple stakeholders:

*   **Individual Households & Consumers**: Well-meaning citizens experience "wishcycling" (placing non-recyclable items in the recycling bin hoping they can be recycled). They lack real-time guidance and face frustration due to confusing, text-heavy local recycling charts.
*   **Municipalities & Local Governments**: Cities bear the massive financial burden of sorting contaminated waste, running public awareness campaigns that yield low compliance, and managing overflowing landfills.
*   **Recycling Facilities & Workers**: Facilities experience high operational costs due to manual pre-sorting of contaminated streams, damage to processing machinery from non-recyclable items (e.g., plastic bags wrapping around gears), and occupational hazards.
*   **The Global Environment**: Unsegregated organic waste in landfills decomposes anaerobically, producing methane (a greenhouse gas 28 times more potent than carbon dioxide). Plastic waste leaks into oceans, fragmenting into microplastics and threatening marine ecosystems.

---

## 4. Why Existing Solutions Fail
Current efforts to improve waste segregation fall short due to structural, economic, and friction-based limitations:

1.  **Static Educational Materials**: 
    *   *Mechanism*: Flyers, pamphlets, and sticker diagrams pasted on bins.
    *   *Failure Mode*: These materials are easily ignored, fade over time, and cannot adapt to new products or local changes in waste regulations. They require consumers to match their items against generalized illustrations, which is highly error-prone.
2.  **Directory-based Recycling Apps**:
    *   *Mechanism*: Applications that allow users to search for items in a text-based database.
    *   *Failure Mode*: High friction. A user holding a piece of trash must open an app, type the item's name (which they may not know, e.g., "tetra pak" vs "carton"), and scroll through categories. Most users choose convenience (throwing it in general waste) over manual searching.
3.  **Hardware-based Smart Bins**:
    *   *Mechanism*: Smart trash cans equipped with internal cameras and sorting flaps.
    *   *Failure Mode*: Prohibitively expensive (ranging from hundreds to thousands of dollars per unit). They are economically unfeasible for widespread residential deployment and only solve the problem at municipal collection sites, rather than educating consumers at the source.

---

## 5. The EcoSort AI Solution
EcoSort AI addresses the segregation crisis by removing user friction and providing instant, context-aware instructions using computer vision.

### How the AI Approach Works:
*   **Zero-Friction Vision Interface**: Consumers simply scan the item using their mobile browser camera or upload a quick photo. They do not need to name or describe the object.
*   **Multimodal Object Recognition**: Utilizing the `google/gemini-2.5-flash` model, EcoSort AI processes the image to identify the material composition of the object instantly, recognizing even complex materials (e.g., compound plastics, composite packaging).
*   **Localized, Actionable Output**: The AI maps the identified material against local disposal regulations to provide:
    1.  **Waste Type & Category**: Exact material identification.
    2.  **Disposal Bin**: Visual, color-coded bin recommendations (e.g., Blue Bin for paper/plastic recycling, Green Bin for organic compost).
    3.  **Recyclability Indicator**: Clear status badges indicating whether it is recyclable or landfill waste.
    4.  **Handling Tip**: Instant, micro-tips (e.g., *"Rinse out milk residue to prevent contamination"*, *"Remove the plastic cap before recycling"*).

### Technical Innovation & Architecture:
EcoSort AI is designed as a lightweight, highly responsive web application built with a **React + Vite** frontend and an **Express Node.js** backend. 
- **Privacy and Safety**: Uploaded files are processed in secure temporary directories (`os.tmpdir()`) and deleted immediately after classification to respect user privacy.
- **Extreme Speed**: By leveraging the light and optimized Gemini 2.5 Flash model via the OpenRouter API, responses are generated in under a second, making real-time scan-to-bin behavior practical at the trash can.

---

## 6. Impact & Future Vision
By deploying an accessible, AI-powered visual sorting assistant, EcoSort AI changes consumer behavior at the exact moment of disposal.
*   **Reduced Contamination**: Actionable tips (like washing jars) prevent batch contamination in municipal recycling centers.
*   **Higher Diversion Rates**: Wishcycling is replaced by accurate sorting, increasing the volume of clean recyclables diverted from landfills.
*   **Scalability**: The web app can scale globally at minimal cost, adjusting its classification rules dynamically based on geolocation metadata to match the specific recycling rules of any city.
