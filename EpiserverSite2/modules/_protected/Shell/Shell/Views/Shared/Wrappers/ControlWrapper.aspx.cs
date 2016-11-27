using System;
using System.Web;
using System.Web.UI;
using EPiServer.ServiceLocation;
using EPiServer.Shell.ViewComposition;

namespace EPiServer.Shell.UI.Views.Shared.Wrappers
{
    public partial class ControlWrapper : System.Web.UI.Page
    {
        private readonly IComponentManager _componentManager;

        public ControlWrapper()
        {
            _componentManager = ServiceLocator.Current.GetInstance<ComponentManager>();
        }

        protected override void OnInit(EventArgs e)
        {
            base.OnInit(e);
            
            string fullName = Request.Params.Get("fn");

            if (String.IsNullOrEmpty(fullName))
            {
                return;
            }

            IComponent c = _componentManager.CreateComponent(fullName, Page.User);
            string uri = (string)c.Settings["controlUri"];
            if (!String.IsNullOrEmpty(uri))
            {
                placeHolderControl.Controls.Add(LoadControl(uri));
            }
            else
            { 
                throw (new Exception("Control cannot be wrapped without a URI to its ascx"));
            }
        }

        protected override void RenderChildren(HtmlTextWriter writer)
        {
            try
            {
                base.RenderChildren(writer);
            }
            catch (HttpException ex)
            {
                writer.WriteFullBeginTag("div");
                writer.WriteFullBeginTag("h1");
                writer.WriteEncodedText("Error: Control could not be loaded");
                writer.WriteEndTag("h1");

                writer.WriteFullBeginTag("p");
                writer.WriteEncodedText(ex.Message);
                writer.WriteEndTag("p");
                writer.WriteEndTag("div");
            }
        }
    }
}