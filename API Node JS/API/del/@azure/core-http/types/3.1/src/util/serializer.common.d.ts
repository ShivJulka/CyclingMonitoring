/**
 * Default key used to access the XML attributes.
 */
export declare const XML_ATTRKEY = "$";
/**
 * Default key used to access the XML value content.
 */
export declare const XML_CHARKEY = "_";
/**
 * Options to govern behavior of xml parser and builder.
 */
export interface SerializerOptions {
    /**
     * indicates the name of the root element in the resulting XML when building XML.
     */
    rootName?: string;
    /**
     * indicates whether the root element is to be included or not in the output when parsing XML.
     */
    includeRoot?: boolean;
    /**
     * key used to access the XML value content when parsing XML.
     */
    xmlCharKey?: string;
}
//# sourceMappingURL=serializer.common.d.ts.map
