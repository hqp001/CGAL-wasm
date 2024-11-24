#include <emscripten/bind.h>
#include <CGAL/Hyperbolic_Delaunay_triangulation_traits_2.h>
#include <CGAL/Hyperbolic_Delaunay_triangulation_2.h>
#include <vector>
#include <array>
#include <algorithm>
#include <iostream>

// Define CGAL types
typedef CGAL::Hyperbolic_Delaunay_triangulation_traits_2<> Traits;
typedef Traits::Point_2 Point_2;
typedef CGAL::Hyperbolic_Delaunay_triangulation_2<Traits> Hyperbolic_Delaunay;
typedef Traits::Circular_arc_2 Circular_arc_2;
typedef Traits::Euclidean_segment_2 Line_arc_2;


// Convert JavaScript array to C++ vector of CGAL points
std::vector<Point_2> jsArrayToCppArray(emscripten::val jsArray) {
    std::vector<Point_2> cppArray;
    int length = jsArray["length"].as<int>();

    for (int i = 0; i < length; ++i) {
        emscripten::val jsPoint = jsArray[i];
        double x = jsPoint["x"].as<double>();
        double y = jsPoint["y"].as<double>();
        cppArray.emplace_back(x, y);
        std::cout << x << " " << y << std::endl;
    }

    return cppArray;
}

// Convert C++ vector of faces (indices) to JavaScript array
emscripten::val cppArrayToJsArray(const std::vector<std::array<double, 6>>& cppArray) {
    emscripten::val jsArray = emscripten::val::array();

    for (size_t i = 0; i < cppArray.size(); ++i) {
        emscripten::val jsFace = emscripten::val::array();
        jsFace.set(0, cppArray[i][0]);
        jsFace.set(1, cppArray[i][1]);
        jsFace.set(2, cppArray[i][2]);
        jsFace.set(3, cppArray[i][3]);
        jsFace.set(4, cppArray[i][4]);
        jsFace.set(5, cppArray[i][5]);
        jsArray.set(i, jsFace);
    }

    return jsArray;
}

// Process C++ vector: Compute Hyperbolic Delaunay triangulation faces as indices
std::vector<std::array<double, 6>> processCppArray(const std::vector<Point_2>& cppArray) {
    Hyperbolic_Delaunay hdt;
    hdt.insert(cppArray.begin(), cppArray.end());

    std::vector<std::array<double, 6>> edges;

    /*
    for (auto face = hdt.finite_faces_begin(); face != hdt.finite_faces_end(); ++face) {
        int idx1 = std::distance(cppArray.begin(), std::find(cppArray.begin(), cppArray.end(), face->vertex(0)->point()));
        int idx2 = std::distance(cppArray.begin(), std::find(cppArray.begin(), cppArray.end(), face->vertex(1)->point()));
        int idx3 = std::distance(cppArray.begin(), std::find(cppArray.begin(), cppArray.end(), face->vertex(2)->point()));
    */
        // Iterate through all edges
    for (auto edge = hdt.all_edges_begin(); edge != hdt.all_edges_end(); ++edge) {
        // Get the vertices of the edge
        auto vertex1 = edge->first->vertex(hdt.cw(edge->second));
        auto vertex2 = edge->first->vertex(hdt.ccw(edge->second));

        // Find the indices of the vertices in the original array
        int idx1 = std::distance(cppArray.begin(), std::find(cppArray.begin(), cppArray.end(), vertex1->point()));
        int idx2 = std::distance(cppArray.begin(), std::find(cppArray.begin(), cppArray.end(), vertex2->point()));

        hdt.hyperbolic_segment(*edge);
        auto ed = hdt.hyperbolic_segment(*edge);
        
        if (std::holds_alternative<Circular_arc_2>(ed)) {
            const Circular_arc_2& arc = std::get<Circular_arc_2>(ed);

            edges.push_back({
                idx1 * 1.0,
                idx2 * 1.0,
                1.0,
                CGAL::to_double(arc.center().x()),
                CGAL::to_double(arc.center().y()),
                CGAL::to_double(arc.squared_radius())
            });
        } else if (std::holds_alternative<Line_arc_2>(ed)) {
            const Line_arc_2& segment = std::get<Line_arc_2>(ed);

            // Access the segment's endpoints
            const auto& p1 = segment.source();
            const auto& p2 = segment.target();

            std::cout << "Segment: start = " << p1
                      << ", end = " << p2 << std::endl;
            edges.push_back({idx1 * 1.0, idx2 * 1.0, 1.0, 0, 0, 0});
        }

    }


    return edges;
}

// Combined function: Convert JS -> C++, Process, Convert C++ -> JS
emscripten::val processArray(emscripten::val jsArray) {
    std::vector<Point_2> cppArray = jsArrayToCppArray(jsArray);
    std::vector<std::array<double, 6>> processedArray = processCppArray(cppArray);
    return cppArrayToJsArray(processedArray);
}

// Binding
EMSCRIPTEN_BINDINGS(hyperbolic_delaunay_module) {
    emscripten::function("processArray", &processArray);
}
