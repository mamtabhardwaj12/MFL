module.exports = {
    STATUSCODES:function (){return StatusCodes}
}

const StatusCodes =
{
    Draft: 'Draft',
    New: 'New',
    Activated: 'Mark for Activation',
    Deactivated: 'Mark for Deactivation',
    ResponsePending: 'Response Pending',
    
    Issued: 'Issued',
    Rejected: 'Rejected',
    
    Updated: 'Updated',
    Discarded: 'Discard',
    
    Posting_Pending: 'Posting Pending',
    Approved: 'Approved',
    Rejected_By_Supplier: 'Rejected By Supplier',
    Rejected_By_Manufacturer: 'Rejected By Manufacturer',
    Rejected_By_FI: 'Rejected By FI',

    AcceptRejection: 'Accept Rejection'
}