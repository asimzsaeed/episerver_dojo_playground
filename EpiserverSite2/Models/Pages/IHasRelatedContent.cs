using EPiServer.Core;

namespace EpiserverSite2.Models.Pages
{
    public interface IHasRelatedContent
    {
        ContentArea RelatedContentArea { get; }
    }
}
