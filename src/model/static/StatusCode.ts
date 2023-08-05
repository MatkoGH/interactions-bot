// # Status Code

export enum StatusCode {

    // * Informational
    
    /** The server has received the request and is continuing to process it */
    Continue = 100,

    /** The server has switched protocols in response to a request */
    SwitchingProtocols = 101,

    /** The server is processing the request, but no response is available yet */
    Processing = 102,

    /** Used to indicate that the client should continue with its request */
    EarlyHints = 103,

    // * Successful

    /** The server has successfully fulfilled the request */
    OK = 200,

    /** The request has been fulfilled and a new resource has been created */
    Created = 201,

    /** The request has been accepted for processing, but the processing is not yet complete */
    Accepted = 202,

    /** The server has received the request but needs further information to complete it */
    NonAuthoritativeInformation = 203,

    /** The server successfully processed the request, but there's no content to send in the response */
    NoContent = 204,

    /** The server successfully processed the request, but there's no content to send, and the client should reset the document view */
    ResetContent = 205,

    /** The server has fulfilled the partial GET request for a resource */
    PartialContent = 206,

    /** The server is returning the meta information of the resource */
    MultiStatus = 207,
    
    /** The requested resource has been fetched and is transmitted in the message body */
    IMUsed = 226,

    // * Redirection

    /** The requested resource corresponds to any one of a set of representations */
    MultipleChoices = 300,

    /** The requested resource has been assigned a new permanent URI */
    MovedPermanently = 301,

    /** The requested resource has been assigned a different URI */
    Found = 302,

    /** The response to the request can be found under a different URI */
    SeeOther = 303,

    /** The client should use the proxy server's location for the next request */
    NotModified = 304,

    /** The requested resource must be accessed through the proxy given by the location field */
    UseProxy = 305,

    /** The server is transitioning to a new protocol */
    SwitchProxy = 306,

    /** The requested resource resides temporarily under a different URI */
    TemporaryRedirect = 307,

    /** The requested resource has been permanently moved to another location */
    PermanentRedirect = 308,
    
    // * Client error

    /** The server could not understand the request due to malformed syntax */
    BadRequest = 400,

    /** The client must authenticate itself to get the requested response */
    Unauthorized = 401,

    /** The client does not have permission to access the requested resource */
    Forbidden = 403,

    /** The server did not find the requested resource */
    NotFound = 404,

    /** The request method is not supported by the requested resource */
    MethodNotAllowed = 405,

    /** The request was not accepted because the requested resource does not support the request method */
    NotAcceptable = 406,

    /** The client must first authenticate itself to get the requested response */
    ProxyAuthenticationRequired = 407,

    /** The server timed out waiting for the request */
    RequestTimeout = 408,

    /** The request could not be completed due to a conflict with the current state of the target resource */
    Conflict = 409,

    /** The requested resource is no longer available at the server */
    Gone = 410,

    /** The server refuses to accept the request without a valid Content-Length header field */
    LengthRequired = 411,

    /** The precondition given in one or more of the request-header fields evaluated to false */
    PreconditionFailed = 412,

    /** The server does not meet one of the preconditions specified by the client */
    PayloadTooLarge = 413,

    /** The client has asked for a portion of the file, but the server cannot supply that portion */
    RequestedRangeNotSatisfiable = 416,

    /** The client has asked for a range that lies beyond the current extent of the resource */
    ExpectationFailed = 417,

    /** The server cannot meet the requirements of the Expect request-header field */
    ImATeapot = 418,

    /** The request was directed at a server that is not able to produce a response */
    MisdirectedRequest = 421,

    /** The request was well-formed but was unable to be followed due to semantic errors */
    UnprocessableEntity = 422,

    /** The resource that is being accessed is locked */
    Locked = 423,

    /** The request failed due to failure of a previous request */
    FailedDependency = 424,

    /** The client should switch to a different protocol such as TLS/1.0 */
    UpgradeRequired = 426,

    /** The origin server requires the request to be conditional */
    PreconditionRequired = 428,

    /** The user has sent too many requests in a given amount of time */
    TooManyRequests = 429,

    /** The server is unwilling to process the request because an encounter occurred that is not able to be handled */
    UnavailableForLegalReasons = 451,

    // * Server error

    /** The server encountered an unexpected condition that prevented it from fulfilling the request */
    InternalServerError = 500,

    /** The server does not recognize the request method */
    NotImplemented = 501,

    /** The server, while acting as a gateway or proxy, received an invalid response from the upstream server it accessed in attempting to fulfill the request */
    BadGateway = 502,

    /** The server is currently unable to handle the request due to temporary overloading or maintenance of the server */
    ServiceUnavailable = 503,

    /** The server, while acting as a gateway or proxy, did not receive a timely response from the upstream server or some other auxiliary server it needed to access in order to complete the request */
    GatewayTimeout = 504,

    /** The server does not support the HTTP protocol version that was used in the request */
    HTTPVersionNotSupported = 505,

    /** Transparent content negotiation for the request, results in a circular reference */
    VariantAlsoNegotiates = 506,

    /** The server has an internal configuration error */
    InsufficientStorage = 507,

    /** The server terminated an operation because it encountered an infinite loop while processing a request */
    LoopDetected = 508,

    /** Further extensions to the request are required for the server to fulfill it */
    NotExtended = 510,

    /** The client needs to authenticate to gain network access */
    NetworkAuthenticationRequired = 511,
}
